import React from "react";
import {connect} from "react-redux";
import ReactHighcharts from "react-highcharts";
import {bindActionCreators} from "redux";
import * as actionCreators from "../redux/actions/actions";
import {getServiceUsage} from "../common/api.js";
import Constants from "../common/Constants";
import {generateSeries} from "../common/Helper";


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
            loading: false,
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
        this.setState({loading: true});
        getServiceUsage(this.props.groupId, this.props.serviceId, 0, 1000,
            new Date(this.props.serviceUsage.filter.date).getTime(), this.props.serviceUsage.filter.itemIdList,
            this.props.login.currentUser.id).then((resolve) => {
            let serviceUsageList = JSON.parse(resolve.responseText);
            this.props.actions.setServiceUsageChartData(generateSeries(serviceUsageList));
        }).catch((err) => {
            if (err.status == Constants.HttpStatus.BAD_REQUEST) {
                this.setState({loading: false, msg: err.responseText});
            }
            else {
                console.error(err);
                this.setState({loading: false, msg: Constants.GENERIC_ERROR_MSG});
            }
        });
    }

    render() {
        console.debug("Service usage chart render");
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="btn-group pull-right">
                            <button
                                onClick={() => this.setChartData()} type="button"
                                className="btn btn-default" aria-expanded="false">
                                <i className="fa fa-refresh cyan" aria-hidden="true"></i> Refresh
                            </button>
                        </div>
                    </div>
                </div>
                <ReactHighcharts config={this.props.serviceUsage.chart.config} isPureConfig={true}/>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceUsageChart);