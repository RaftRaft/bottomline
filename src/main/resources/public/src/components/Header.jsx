import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";

function mapStateToProps(state) {
    return {login: state.login};
}

class Header extends React.Component {

    constructor(props) {
        super(props);
        console.log("Header constructor");
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
                                <i className="fa fa-pencil-square cyan" aria-hidden="true"></i>
                                <span className="white"> BottomLine</span>
                            </div>
                        </div>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav navbar-right">
                                <li><Link to="main/group"><i
                                    className="fa fa-th-large" aria-hidden="true"></i> Groups</Link></li>
                                <li><a href="#"><i className="fa fa-cogs" aria-hidden="true"></i> Services</a></li>
                                <li><a href="#"><i className="fa fa-sign-out" aria-hidden="true"></i> Sign Out <img
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