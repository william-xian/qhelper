import React from "react";


export class DateV extends React.Component<{ format?: string, value: Date }> {

    render() {
        const value = this.props.value;
        if(value) {
            let dv = value;
            if(!(value instanceof Date)) {
                dv = new Date(value);
            }
            let d = new Date(dv.getTime() - dv.getTimezoneOffset() * 60000);
            let len = (this.props.format || 'YYY-DD-MM').length + 1;
            let v = d.toISOString().replace("T", " ").substring(0, len);
            return (<span>{v}</span>)
        }else {
            return (<span>--</span>);
        }
    }

}
