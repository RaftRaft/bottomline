import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import ReactHighcharts from "react-highcharts";
import {getServiceUsage} from "../common/api.js";
import Constants from "../common/Constants";

function mapStateToProps(state) {
    return {
        login: state.login,
        serviceUsage: state.main.serviceUsage
    }
}

class ServiceUsageChart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            msg: "Service usage list",
            config: {
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        month: '%e. %b',
                        year: '%b'
                    },
                    title: {
                        text: 'Date'
                    }
                },
                series: [
                    {
                        name: 'Winter 2012-2013',
                        data: [
                            [Date.UTC(1970, 9, 21), 14, 12],
                            [Date.UTC(1971, 5, 3), 200, 100]
                        ]
                    }
                ]
            }
        }
        this.getServiceUsageFromServer = this.getServiceUsageFromServer.bind(this);
        console.debug("Service usage chart construct");
    }

    componentDidMount() {
        this.getServiceUsageFromServer();
    }

    getServiceUsageFromServer() {
        this.setState({loading: true});
        getServiceUsage(this.props.groupId, this.props.serviceId, 0, 1000,
            new Date(this.props.serviceUsage.filter.date).getTime(), this.props.serviceUsage.filter.itemIdList,
            this.props.login.currentUser.id).then((resolve) => {
            let serviceUsageList = JSON.parse(resolve.responseText);
            console.log(JSON.stringify(generateSeries(serviceUsageList)));
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
                <ReactHighcharts config={this.state.config} isPureConfig={true}/>
            </div>
        )
    }
}

function generateSeries(serviceUsageList) {
    let series = [];
    for (let i = 0; i < serviceUsageList.length; i++) {
        for (let j = 0; j < series.length; j++) {
            if (series[j].name == serviceUsageList[i].item.label) {
                series[j].data.push([serviceUsageList[i].date, serviceUsageList[i].index]);
                break;
            }
        }
        let object = {};
        object.name = serviceUsageList[i].item.label;
        object.data = [[serviceUsageList[i].date, serviceUsageList[i].index]];
        series.push(object);
    }
    return series;
}

export default connect(mapStateToProps)(ServiceUsageChart);