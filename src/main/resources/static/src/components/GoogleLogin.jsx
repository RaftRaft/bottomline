import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {hashHistory} from "react-router";
import * as actionCreators from "../redux/actions/actions";
import {acceptInvitation, addUser} from "../common/api";


function mapStateToProps(state, ownProps) {
    return {
        invitationCode: ownProps.params.invitationCode,
    };
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
        this.buildUser = this.buildUser.bind(this);
        this.renderButton = this.renderButton.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onFailure = this.onFailure.bind(this);
        this.updateState = this.updateState.bind(this);
        this.initGoogleAuth = this.initGoogleAuth.bind(this);
    }

    buildUser(user) {
        let build = {
            id: user.getId(),
            name: user.getBasicProfile().getName(),
            profileImageUrl: user.getBasicProfile().getImageUrl(),
            email: user.getBasicProfile().getEmail()
        }
        return build;
    }

    updateState(state) {
        this.setState(state);
    }

    componentDidMount() {
        this.initGoogleAuth(this.updateState, this.props, this.buildUser);
    }

    componentDidUpdate() {
        if (!this.state.loading && !this.state.error) {
            this.renderButton();
        }
    }

    renderButton() {
        window.gapi.signin2.render('my-signin2', {
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
        this.props.actions.setCurrentUser(this.buildUser(googleUser));
        // Persist user inside database
        let user = this.buildUser(googleUser);
        addUser(JSON.stringify(user)).then((resolve) => {
            if (this.props.invitationCode != null) {
                acceptInvitation(this.props.invitationCode, user.id).then((resolve) => {
                    hashHistory.push("main/group");
                }).catch((err) => {
                    console.error(err);
                });
            } else {
                hashHistory.push("main/group");
            }
        }).catch((err) => {
            console.error('Something bad happened', err.statusText);
        });
    }

    onFailure(error) {
        console.log(error);
    }

    initGoogleAuth(updateState, props, buildUser) {
        window.gapi.load('auth2', function () {
                var auth2 = window.gapi.auth2.init({
                    client_id: '426148587752-j5f2svrk2cff31rjclv8pjg33uisnvu5.apps.googleusercontent.com',
                });
                auth2.then(function () {
                        var isSignedIn = auth2.isSignedIn.get();
                        if (isSignedIn) {
                            console.debug("User is already signed in");
                            props.actions.setCurrentUser(buildUser(auth2.currentUser.get()));
                            // Persist user inside database
                            let user = buildUser(auth2.currentUser.get());
                            addUser(JSON.stringify(user)).then((resolve) => {
                                console.debug(resolve.responseText);
                                if (props.invitationCode != null) {
                                    acceptInvitation(props.invitationCode, user.id).then((resolve) => {
                                        console.debug(resolve.responseText);
                                        hashHistory.push("main/group");
                                    }).catch((err) => {
                                        console.error(err);
                                    });
                                } else {
                                    hashHistory.push("main/group");
                                }
                            }).catch((err) => {
                                console.error('Something bad happened', err.statusText);
                            });
                        } else {
                            console.debug("User NOT signed in");
                            updateState({loading: false});
                        }
                    },
                    function (err) {
                        console.debug("Cannot initialise google authentication" + JSON.stringify(err));
                        updateState({loading: false, error: true});
                    }
                );
            }
        );
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="container margin-top-10percent">
                    <div id="mobilePanelId" className="panel panel-default">
                        <div className="panel-body text-align-center margin-bottom-10percent margin-top-10percent">
                            <i className="fa fa-spinner fa-spin" aria-hidden="true"></i><span className="gray-dark"> Loading...</span>
                        </div>
                    </div>
                </div>
            );
        }
        else if (this.state.error) {
            return (
                <div className="container margin-top-10percent">
                    <div id="mobilePanelId" className="panel panel-danger">
                        <div className="row">
                            <div className="col-xs-3 col-md-5">
                                <img className="pull-right margin-top-2vh margin-bottom-2em"
                                     src={"src/img/bird_blue.png"} width="72px"
                                     height="72px"/>
                            </div>
                            <div className="col-xs-9 col-md-7">
                                <h3 className="gray-dark">BottomLine</h3>
                                <h5 className="gray-dark">Authentication failed :(</h5>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="container margin-top-10percent">
                    <div id="mobilePanelId" className="panel panel-default">
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-xs-3 col-md-5">
                                    <img className="pull-right margin-top-2vh" src={"src/img/bird_blue.png"}
                                         width="72px"
                                         height="72px"/>
                                </div>
                                <div className="col-xs-9 col-md-7">
                                    <h3 className="gray-dark">BottomLine</h3>
                                    <h5 className="gray-dark">Track your expenses (trip expenses, energy bills),
                                        the consumption of your house
                                        utilities (energy and water consumption) ...</h5>
                                    <h6 className="gray-dark">... and much more</h6>
                                </div>
                            </div>
                            <div id="my-signin2"
                                 className="horizontal-fill margin-bottom-10percent margin-top-10percent"></div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoogleLogin);