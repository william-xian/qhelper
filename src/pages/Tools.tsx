import React, { VideoHTMLAttributes } from "react";
import { Alert, Button, Col, Divider, Icon, Input, InputGroup, InputNumber, Panel, Row } from "rsuite";

export class Tools extends React.Component {

    state = {
        inc: 0,
        used: 0,
        need: 0,
        info: {
            income: 0,
            done: 0,
        }
    }
    componentDidMount() {
        this.init();
    }

    init() {
        let jsonPersons = window.localStorage.getItem("persons");

        let jsonInfo = window.localStorage.getItem("info");
        let data = [];
        if (jsonPersons) {
            try {
                data = JSON.parse(jsonPersons);
            } catch (e) {
                data = [];
            }
        }
        let info = {
            income: 0,
            done: 0
        }
        if (jsonInfo) {
            try {
                info = JSON.parse(jsonInfo);
            } catch (e) {
            }
        }
        let used = 0;
        let need = 0;
        let now = new Date();
        let nextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 1);
        for (let x of data) {
            used += x.times;
            for (let i = x.times; i < x.plan.length; i++) {
                if (x.plan[i] < nextMonth) {
                    need++;
                } else {
                    break;
                }
            }
        }
        this.setState({ info, used, need });
    }

    addIncome() {
        const { inc, info } = this.state;
        info.income += parseInt(inc.toString()) * 2;
        window.localStorage.setItem("info", JSON.stringify(info));
        this.setState({ inc: 0, info });
    }

    openCamera() {
        const video: any = document.getElementById("video");
        let msg = new Array<string>();
    }

    render() {
        const { inc, info, used, need } = this.state;
        let remain = info.income - info.done - used;
        return (
            <div>
                <Panel bordered style={{ margin: '6px' }}>
                    <Divider style = {{marginTop: "2px"}}>药量概况</Divider>
                    <Row>
                        <Col>
                            <InputGroup>
                                <InputGroup.Addon>总共进货:</InputGroup.Addon>
                                <Input readOnly value={(info.income / 2).toString()}></Input>
                                <InputGroup.Addon>盒</InputGroup.Addon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputGroup>
                                <InputGroup.Addon>总共使用:</InputGroup.Addon>
                                <Input readOnly value={((info.done + used) / 2).toString()}></Input>
                                <InputGroup.Addon>盒</InputGroup.Addon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputGroup>
                                <InputGroup.Addon>剩余库存:</InputGroup.Addon>
                                <Input readOnly value={(remain / 2).toString()}></Input>
                                <InputGroup.Addon>盒</InputGroup.Addon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputGroup>
                                <InputGroup.Addon>下月还需:</InputGroup.Addon>
                                <Input readOnly value={(need / 2).toString()}></Input>
                                <InputGroup.Addon>盒</InputGroup.Addon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputGroup>
                                <InputGroup.Addon>下月需进:</InputGroup.Addon>
                                <Input readOnly value={(Math.max(0, (need - remain)) / 2).toString()}></Input>
                                <InputGroup.Addon>盒</InputGroup.Addon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Divider>更改库存</Divider>
                    <Row>
                        <Col>
                            <InputGroup>
                                <InputGroup.Addon>进货盒数:</InputGroup.Addon>
                                <InputNumber value={inc} onChange={(v) => this.setState({ inc: v })} />
                                <InputGroup.Button>
                                    <Icon icon="plus" onClick={() => this.addIncome()} />
                                </InputGroup.Button>
                            </InputGroup>
                        </Col>
                    </Row>
                </Panel>
                <Panel bordered style={{ margin: '6px' }}>
                    <Row><Button onClick={() => this.openCamera()}>打开</Button></Row>
                    <Divider /> 
                    <video id="video" autoPlay={true} style={{ height: 128, width: 128, background: 'blue' }} ></video>
                </Panel>
            </div>
        );
    }
}