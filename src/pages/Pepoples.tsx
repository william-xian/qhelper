import React from "react";
import { Alert, Button, ButtonToolbar, Notification, ControlLabel, DatePicker, Drawer, Form, FormControl, FormGroup, Icon, Table, Timeline, InputNumber } from "rsuite";
import { DateV } from "../components/base";

const DAY_MILLS = 24 * 60 * 60 * 1000;

class Peoples extends React.Component {
    state = {
        addVisible: false,
        added: true,
        np: { name: '', remark: '', time: new Date(), firstTimes: 2, interval: 14, plan: [] },
        info: { income: 0, done: 0 },
        data: [{ name: '张三', times: 0, plan: [new Date()] }]
    }
    componentDidMount() {
        let json = window.localStorage.getItem("persons");
        let data = [];
        if (json) {
            try {
                data = JSON.parse(json);
            } catch (e) {
                data = [];
            }
        }
        let jsonInfo = window.localStorage.getItem("info");
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
        this.setState({ data, info });
    }
    componentDidUpdate() {

    }
    set(obj: any) {
        let { np } = this.state;
        Object.assign(np, obj);
        this.setState({ np });
    }
    setPlan() {
        const { np } = this.state;
        let plan: any = [];
        let time = np.time.getTime();
        for (let i = 0; i < np.firstTimes; i++) {
            plan.push(time);
        }
        for (let i = np.firstTimes, f = 1; i < 10; i++, f++) {
            plan.push(time + (f * np.interval * DAY_MILLS));
        }
        np.plan = plan;
        this.setState({ np })
    }
    add() {
        const { added, np } = this.state;
        let json = window.localStorage.getItem("persons");
        let data = [];
        if (json) {
            try {
                data = JSON.parse(json);
            } catch (e) {
                data = [];
            }
        }
        let old = data.find((v: any) => v.name === np.name);
        if (old && added) {
            Alert.error(`用户名(${np.name})已经存在，如果重名请加编号如:${np.name}2`)
        } else {
            if (old) {
                let oi = data.findIndex((v: any) => v.name === np.name);
                data.splice(oi, 1);
            }

            data.push({ name: np.name, times: parseInt(np.firstTimes.toString()), plan: np.plan });
            data.sort((a: any, b: any) => a.plan[a.times] - b.plan[b.times])
            window.localStorage.setItem("persons", JSON.stringify(data));
            this.setState({ addVisible: false, data })
        }
    }
    edit(item: any) {
        let { np } = this.state;
        Object.assign(np, item);
        this.setState({ addVisible: true, added: false, np });
    }

    updateTimes(item: any) {
        let callback = () => {
            item.times = item.times + 1;
            const { data } = this.state;
            window.localStorage.setItem("persons", JSON.stringify(data));
            data.sort((a: any, b: any) => a.plan[a.times] - b.plan[b.times])
            this.setState({ data })
        }
        Notification.open({
            key: 'update',
            title: '今日打针?',
            description: (
                <div>
                    <p>您确定该患者今天打针?</p>
                    <ButtonToolbar>
                        <Button size="xs" color="blue" onClick={() => { Notification.close('update') }}>取消</Button>
                        <Button size="xs" color="green" onClick={() => { callback(); Notification.close('update') }}>确定</Button>
                    </ButtonToolbar>
                </div>
            )
        });
    }

    delete(item: any) {
        let callback = () => {
            const { data, info } = this.state;
            let i = data.findIndex((v) => v.name === item.name)
            data.splice(i, 1);
            window.localStorage.setItem("persons", JSON.stringify(data));
            info.done += item.times;
            window.localStorage.setItem("info", JSON.stringify(info));
            this.setState({ data })
        }
        Notification.warning({
            key: 'delete',
            title: '删除用户?',
            description: (
                <div>
                    <p>您确定该患者已经打完并删除?</p>
                    <ButtonToolbar>
                        <Button size="xs" color="green" onClick={() => { Notification.close('update') }}>取消</Button>
                        <Button size="xs" color="red" onClick={() => { callback(); Notification.close('delete') }}>确定</Button>
                    </ButtonToolbar>
                </div>
            )
        });
    }
    render() {
        const { addVisible, np, data } = this.state;
        const height = document.body.clientHeight-42;
        return (<div>
            <Table data={data} height={height} virtualized bordered>
                <Table.Column align="center" width={100} fixed>
                    <Table.HeaderCell>姓名</Table.HeaderCell>
                    <Table.Cell dataKey="name">
                        {(row: any) => (<Button appearance="link" style={{ margin: 0, padding: 0 }} onClick={() => this.edit(row)}>{row.name}</Button>)}
                    </Table.Cell>
                </Table.Column>
                <Table.Column width={68}>
                    <Table.HeaderCell>针次</Table.HeaderCell>
                    <Table.Cell>
                        {(row: any) => {
                            if (row.times < 10) {
                                return (<span>第{row.times + 1}针</span>);
                            } else {
                                return (<span>完成</span>);
                            }
                        }}
                    </Table.Cell>
                </Table.Column>
                <Table.Column width={120}>
                    <Table.HeaderCell>下次时间</Table.HeaderCell>
                    <Table.Cell>
                        {(row: any) => {
                            return (<DateV value={row.plan[row.times]} />)
                        }
                        }
                    </Table.Cell>
                </Table.Column>
                <Table.Column width={64} fixed="right">
                    <Table.HeaderCell><Icon icon="user-plus" onClick={() => this.setState({ addVisible: true, added: true, })} /></Table.HeaderCell>
                    <Table.Cell>
                        {(rowData: any) => {
                            if (rowData.times < 10) {
                                return (
                                    <span>
                                        <Button appearance="link" style={{ margin: 0, padding: 0 }} onClick={() => this.updateTimes(rowData)}><Icon icon="hospital-o" /></Button>
                                    </span>
                                );
                            } else {
                                return (
                                    <span>
                                        <Button appearance="link" style={{ margin: 0, padding: 0 }} onClick={() => this.delete(rowData)}><Icon icon="close" /></Button>
                                    </span>
                                );
                            }
                        }}
                    </Table.Cell>
                </Table.Column>
            </Table>

            <Drawer show={addVisible} full placement={'bottom'} size={"xs"} onHide={() => this.setState({ addVisible: false })}>
                <Drawer.Header>
                    <Drawer.Title>{np.name || '新增患者'}</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    <Form formValue={np}>
                        <FormGroup>
                            <ControlLabel>姓名</ControlLabel>
                            <FormControl name="name" onChange={(v) => this.set({ name: v })} />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>备注</ControlLabel>
                            <FormControl name="remark" componentClass="textarea" onChange={(v) => this.set({ remark: v })} />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>第一针时间</ControlLabel>
                            <FormControl name="time" accepter={DatePicker} onChange={(v) => this.set({ time: v, plan: [] })} />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>首次打几针</ControlLabel>
                            <FormControl name="firstTimes" accepter={InputNumber} onChange={(v) => this.set({ firstTimes: v, plan: [] })} />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>两针间隔（天)</ControlLabel>
                            <FormControl name="interval" accepter={InputNumber} onChange={(v) => this.set({ interval: v, plan: [] })} />
                        </FormGroup>
                        <Timeline>
                            {np.plan.map((t: Date, i: number) => (
                                <Timeline.Item>
                                    {<DateV value={t} />} 第{i + 1}针
                                </Timeline.Item>))
                            }

                        </Timeline>
                    </Form>
                </Drawer.Body>
                <Drawer.Footer>
                    <Button appearance="default" onClick={() => this.setState({ addVisible: false })}>取消</Button>
                    <Button onClick={() => this.setPlan()} appearance="primary">
                        计划
                    </Button>
                    <Button onClick={() => this.add()} appearance="primary" disabled={np.plan.length === 0}>
                        保存
                    </Button>
                </Drawer.Footer>
            </Drawer>
        </div>
        );
    }
}

export default Peoples;
