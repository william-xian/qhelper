import React from "react";
import { Col, Divider, Icon, Input, InputGroup, InputNumber, Panel, Row } from "rsuite";

import * as IDB from 'idb';


export class Book extends React.Component {
    db: IDB.IDBPDatabase<any> | undefined;
    state = {
        inc: 0,
        income: 0,
        used: 0,
        need: 0,
    }
    componentDidMount() {
        this.init();
    }

    async init() {
        this.db = await IDB.openDB<any>('patient', 1, {
            upgrade(db: IDB.IDBPDatabase<any>, ov: number) {
                if (ov < 1) {
                    const ps = db.createObjectStore('persons');
                    const info = db.createObjectStore('stock');
                }
            },
        });
        let persons = await this.db.getAll("persons");
        let stock = await this.db.getAll("stock");
        let used = 0;
        let need = 0;
        let now = new Date();
        let nextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 1);
        let income = 0;
        for (let s of stock) {
            income += s.val;
        }
        for (let x of persons) {
            used += x.times;
            for (let i = x.times; i < x.plan.length; i++) {
                if (x.plan[i] < nextMonth) {
                    need++;
                } else {
                    break;
                }
            }
        }
        this.setState({income , used, need });
    }

    addIncome() {
        const { inc, income } = this.state;
        let deta = parseInt(inc.toString()) * 2;
        let data = { val: deta, time: new Date().getTime() };
        this.db?.add("stock", data , data.time);
        this.setState({ inc: '0', income:(income+deta) });
    }
    render() {
        const { inc, income, used, need } = this.state;
        let remain = income - used;
        return (
            <div>
                <Panel bordered style={{ margin: '6px' }}>
                    <Divider style={{ marginTop: "2px" }}>药量概况</Divider>
                    <Row>
                        <Col>
                            <InputGroup>
                                <InputGroup.Addon>总共进货:</InputGroup.Addon>
                                <Input readOnly value={(income / 2).toString()}></Input>
                                <InputGroup.Addon>盒</InputGroup.Addon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputGroup>
                                <InputGroup.Addon>总共使用:</InputGroup.Addon>
                                <Input readOnly value={((used) / 2).toString()}></Input>
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
                    <Divider>奖金计算</Divider>
                </Panel>
            </div>
        );
    }
}