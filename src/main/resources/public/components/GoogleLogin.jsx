import React from "react";
import {connect} from "react-redux";
import {createStore, bindActionCreators} from "redux";
import * as actionCreators from "../redux/actions/actions";

function mapStateToProps(state) {
    return {login: state.login};
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actionCreators, dispatch)};
}

class GoogleLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'loading': true,
            'error': false
        }
        ;
        this.renderButton = this.renderButton.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onFailure = this.onFailure.bind(this);
        this.updateState = this.updateState.bind(this);
        this.initGoogleAuth = this.initGoogleAuth.bind(this);
        console.debug("GoogleLogin construct");
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="col-sm-4 col-sm-offset-4 margin-top-10percent">
                    <div className="panel panel-default">
                        <div className="panel-body text-align-center margin-bottom-10percent margin-top-10percent">
                            <i className="fa fa-spinner fa-spin" aria-hidden="true"></i><span> Loading</span>
                        </div>
                    </div>
                </div>
            );
        }
        else if (this.state.error) {
            return (
                <div className="col-sm-4 col-sm-offset-4 margin-top-10percent">
                    <div className="panel panel-danger">
                        <div className="panel-heading">
                            <h3 className="panel-title"><i className="fa fa-google-plus-official"
                                                           aria-hidden="true"></i><span> Authentication error</span>
                            </h3>
                        </div>
                        <div className="panel-body text-align-center margin-bottom-10percent margin-top-10percent">
                            <i className="fa fa-frown-o" aria-hidden="true"></i><span> Something bad happened !</span>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="col-sm-4 col-sm-offset-4 margin-top-10percent">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title"><i className="fa fa-google-plus-official"
                                                           aria-hidden="true"></i><span> Authentication</span>
                            </h3>
                        </div>
                        <div className="panel-body">
                            <div id="my-signin2"
                                 className="horizontal-fill margin-bottom-10percent margin-top-10percent"></div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    updateState(state) {
        this.setState(state);
    }

    componentDidMount() {
        this.initGoogleAuth(this.updateState, this.props);
    }

    componentDidUpdate() {
        if (!this.state.loading && !this.state.error) {
            this.renderButton();
        }
    }

    renderButton() {
        gapi.signin2.render('my-signin2', {
            'scope': 'profile email',
            'width': 240,
            'height': 50,
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': this.onSuccess,
            'onfailure': this.onFailure
        });
    }

    onSuccess(googleUser) {
        console.debug('Logged in as: ' + googleUser.getBasicProfile().getName());
        console.debug('Token: ' + googleUser.getBasicProfile().getImageUrl());
        this.props.actions.setCurrentUser(googleUser);
    }

    onFailure(error) {
        console.log(error);
    }

    initGoogleAuth(updateState, props) {
        gapi.load('auth2', function () {
                var auth2 = gapi.auth2.init({
                    client_id: '426148587752-j5f2svrk2cff31rjclv8pjg33uisnvu5.apps.googleusercontent.com',
                });
                auth2.then(function () {
                        var isSignedIn = auth2.isSignedIn.get();
                        if (isSignedIn) {
                            console.log("User is already signed in");
                            props.actions.setCurrentUser(auth2.currentUser.get());
                        } else {
                            console.log("User NOT signed in");
                            updateState({loading: false});
                        }
                    },
                    function () {
                        console.log("Cannot initialise google authentication");
                        updateState({loading: false, error: true});
                    }
                );
            }
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoogleLogin);