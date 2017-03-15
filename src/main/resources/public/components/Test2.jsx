import React from "react";

class Test2 extends React.Component {

    constructor(props) {
        super(props);
        console.debug("Test2 constructor");
        console.debug("Props: " + this.props.route.myprop);
    }

    render() {
        return (
            <div>
                Test 2
            </div>
        )
    }
}

export default Test2;