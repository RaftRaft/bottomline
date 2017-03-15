import React from "react";

class Test1 extends React.Component {

    constructor(props) {
        super(props);
        console.debug("Invoked test1 constructor");
    }

    render() {
        return (
            <div>
                Test 1
            </div>
        )
    }
}

export default Test1;