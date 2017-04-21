import React from "react";
import {connect} from "react-redux";
import ReactHighcharts from "react-highcharts";
import {bindActionCreators} from "redux";
import * as actionCreators from "../redux/actions/actions";
import {getServiceUsage} from "../common/api.js";
import Constants from "../common/Constants";
import {generateServiceUsageSeries} from "../common/Helper";


function mapStateToProps(state) {
    return {
        login: state.login,
        serviceUsage: state.main.serviceUsage
    }
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}

class ServiceUsageChart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            msg: "Service usage list"
        }
        this.setChartData = this.setChartData.bind(this);
        console.debug("Service usage chart construct");
        ReactHighcharts.Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
    }

    componentDidMount() {
        this.setChartData();
    }

    setChartData() {
        this.props.actions.fetchServiceUsageChartData(true);
        getServiceUsage(this.props.groupId, this.props.serviceId, 0, 1000,
            new Date(this.props.serviceUsage.filter.date).getTime(), this.props.serviceUsage.filter.itemIdList,
            this.props.login.currentUser.id).then((resolve) => {
            this.props.actions.fetchServiceUsageChartData(false);
            let serviceUsageList = JSON.parse(resolve.responseText);
            this.props.actions.setServiceUsageChartData(generateServiceUsageSeries(serviceUsageList,
                this.props.serviceUsage.filter.showConsumption));
        }).catch((err) => {
            this.props.actions.fetchServiceUsageChartData(false);
            if (err.status == Constants.HttpStatus.BAD_REQUEST) {
                this.setState({msg: err.responseText});
            }
            else {
                console.error(err);
                this.setState({msg: Constants.GENERIC_ERROR_MSG});
            }
        });
    }

    render() {
        return (
            <div className="margin-bottom-2em">
                {!this.props.serviceUsage.chart.fetchData && this.props.serviceUsage.chart.config.series.length > 0 ?
                    <div>
                        <ReactHighcharts config={this.props.serviceUsage.chart.config} isPureConfig={true}/>
                    </div> :
                    !this.props.serviceUsage.chart.fetchData && this.props.serviceUsage.chart.config.series.length == 0 ?
                        <div className="row margin-top-2vh">
                            <div className="col-xs-12 text-align-center">
                                <i className="fa fa-line-chart" aria-hidden="true"></i>
                                <small className="gray-dark"> No history data found</small>
                            </div>
                        </div> :
                        <div className="row margin-top-2vh">
                            <div className="col-xs-12 text-align-center">
                                <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                <small className="gray-dark"> Loading chart data</small>
                            </div>
                        </div>
                }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceUsageChart);