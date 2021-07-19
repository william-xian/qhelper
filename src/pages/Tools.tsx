import React from "react";
import { Alert, Button, ButtonGroup, Divider, Icon, Input, Panel, Row, Uploader } from "rsuite";
import { FileType } from "rsuite/lib/Uploader";

import Tesseract from 'tesseract.js';

export class Tools extends React.Component {
    worker = Tesseract.createWorker({
        langPath: 'https://www.onceio.top/rs/lang-data',
        logger: (m:any) => {
            console.log(m);
            //Alert.info(JSON.stringify(m));
        }
    });
    state = {
        text: '',
    }
    stream: MediaStream | null = null;
    componentDidMount() {
        this.init();
    }
    async init() {
        await this.worker.load();
        await this.worker.loadLanguage('chi_sim');
        await this.worker.initialize('chi_sim');
    }
    openBackCamera() {
        const self = this;
        const video: any = document.getElementById("video");
        this.closeCamera();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Not adding `{ audio: true }` since we only want video now
            navigator.mediaDevices.getUserMedia({
                video: { facingMode: { exact: "environment" } }
            }).then(function (stream) {
                //video.src = window.URL.createObjectURL(stream);
                self.stream = stream;
                video.srcObject = stream;
                video.play();
            });
        }
    }

    openFontCamera() {
        const self = this;
        const video: any = document.getElementById("video");
        this.closeCamera();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Not adding `{ audio: true }` since we only want video now
            navigator.mediaDevices.getUserMedia({
                video: { 'facingMode': "user" }
            }).then(function (stream) {
                //video.src = window.URL.createObjectURL(stream);
                self.stream = stream;
                video.srcObject = stream;
                video.play();
            });
        }
    }
    closeCamera() {
        if (this.stream) {
            let i = 0;
            for (let t of this.stream.getVideoTracks()) {
                try {
                    this.stream.removeTrack(t)
                    if (t && t.stop) {
                        t.stop();
                    }
                } catch (e) {
                    Alert.error("getVideoTracks" + (++i) + ": " + e);
                }
            }
        }
    }

    async translate() {
        if (this.stream) {
            let url = window.URL.createObjectURL(this.stream);
            const { data: { text } } = await this.worker.recognize(url);
            this.setState({ text })
        }
    }

    async translateFile(file: FileType) {
        if(file && file.blobFile){
            const { data: { text } } = await this.worker.recognize(file.blobFile);
            this.setState({ text })
        }
    }

    render() {
        const { text } = this.state;
        const size = Math.min(document.body.clientWidth, document.body.clientHeight) - 54;
        return (
            <div>
                <Panel bordered style={{ margin: '6px' }}>
                    <Divider >
                        <ButtonGroup>
                            <Button onClick={() => this.openFontCamera()}><Icon icon="camera" />前</Button>
                            <Button onClick={() => this.openBackCamera()}><Icon icon="camera-retro" />后</Button>
                            <Button onClick={() => this.closeCamera()}>关闭</Button>
                            <Button onClick={() => this.translate()}>转换</Button>
                        </ButtonGroup>
                    </Divider>
                    <video id="video" autoPlay={true} width={size} height={size} style={{ background: 'blue' }} ></video>
                    <Divider>
                        <ButtonGroup>
                            <Uploader fileListVisible={false}
                                shouldUpload={(file: FileType) => {
                                    this.translateFile(file);
                                    return false;
                                }} ><Button>本地图片转换</Button></Uploader>
                        </ButtonGroup>
                    </Divider>
                    <Row>
                        <Input componentClass="textarea" value={text} rows={3} placeholder="图片转换的文本"></Input>
                    </Row>
                </Panel>
            </div>
        );
    }
}