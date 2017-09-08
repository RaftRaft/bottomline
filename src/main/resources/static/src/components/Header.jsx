import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";


function mapStateToProps(state) {
    return {login: state.login};
}

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.signOut = this.signOut.bind(this);
    }

    signOut() {
        window.gapi.load('auth2', function () {
            var auth2 = window.gapi.auth2.init({
                client_id: '426148587752-j5f2svrk2cff31rjclv8pjg33uisnvu5.apps.googleusercontent.com',
            });
            auth2.then(function () {
                var isSignedIn = auth2.isSignedIn.get();
                if (isSignedIn) {
                    auth2.signOut();
                }
            })
        })
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                    data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <div className="navbar-brand">
                                <div>
                                    <img src={"src/img/bird_blue_small.png"} width="22px" height="22px"/><span
                                    className="white"> BottomLine</span>
                                </div>
                            </div>
                        </div>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav navbar-right">
                                <li><Link to="main/group"><i
                                    className="fa fa-cubes" aria-hidden="true"></i>&nbsp;Groups</Link></li>
                                <li><Link to="main/service/list"><i className="fa fa-cogs" aria-hidden="true"></i>&nbsp;
                                    Services</Link></li>
                                <li><a href="#" onClick={() => this.signOut()}><i className="fa fa-sign-out"
                                                                                  aria-hidden="true"></i>&nbsp;&nbsp;
                                    Sign
                                    Out&nbsp;&nbsp;<img
                                        width="22px" height="22px"
                                        src={this.props.login.currentUser.profileImageUrl}
                                        className="img-circle"/></a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(Header);