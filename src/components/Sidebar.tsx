import {
    FileTextOutlined,
    InfoCircleOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    MenuOutlined,
} from "@ant-design/icons";
import { Col, Image, Layout, Menu, Modal, Row, Typography } from "antd";
import { SchemaCodeEditor } from "react-formule";
import formuleLogo from "../assets/logo.png";

interface SidebarProps {
    menuHidden: boolean;
    setMenuHidden: (hidden: boolean) => void;
    showPreview: boolean;
    setShowPreview: (show: boolean) => void;
    viewerOpen: boolean;
    setViewerOpen: (open: boolean) => void;
    helpOpen: boolean;
    setHelpOpen: (open: boolean) => void;
    schema: any;
    uiSchema: any;
    formData: any;
}

export function Sidebar({
    menuHidden,
    setMenuHidden,
    showPreview,
    setShowPreview,
    viewerOpen,
    setViewerOpen,
    helpOpen,
    setHelpOpen,
    schema,
    uiSchema,
    formData,
}: SidebarProps) {
    return (
        <Layout.Sider
            hidden={menuHidden}
            width={200}
            collapsedWidth={64}
            collapsed
            theme="light"
            style={{
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 500,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "15px 6px",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "center",
                    cursor: "pointer",
                }}
                onClick={() => setMenuHidden(!menuHidden)}
            >
                <MenuOutlined style={{ fontSize: 36 }} />
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "15px 6px",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "center",
                    cursor: "pointer",
                }}
                onClick={() => setMenuHidden(!menuHidden)}
            >
                <Image
                    src={formuleLogo}
                    alt="Logo"
                    preview={false}
                    style={{ maxWidth: "120px" }}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "calc(100% - 140px)",
                    overflow: "auto",
                }}
            >
                <Menu
                    selectable={false}
                    mode="inline"
                    style={{ borderRight: "none", flex: "auto" }}
                />
                <Menu
                    selectable={false}
                    mode="inline"
                    style={{ borderRight: "none" }}
                    items={[
                        {
                            key: "togglereview",
                            icon: showPreview ? <EyeInvisibleOutlined /> : <EyeOutlined />,
                            label: "Show preview",
                            onClick: () => setShowPreview(!showPreview),
                        },
                        {
                            key: "view",
                            icon: <FileTextOutlined />,
                            label: "View Schema",
                            onClick: () => setViewerOpen(true),
                        },
                        {
                            key: "toggleOverview",
                            icon: <InfoCircleOutlined />,
                            label: "Overview",
                            onClick: () => setHelpOpen(true),
                        },
                    ]}
                />
            </div>

            <Modal
                title="Help"
                open={helpOpen}
                onCancel={() => setHelpOpen(false)}
                width={1000}
                footer={null}
            >
                [TODO]
            </Modal>

            <Modal
                title="Generated JSON schemas"
                open={viewerOpen}
                onCancel={() => setViewerOpen(false)}
                width={1000}
                footer={null}
            >
                <Row gutter={[10, 10]}>
                    <Col xs={24} style={{ overflowX: "hidden", height: "100%" }}>
                        <Typography.Text strong>Schema</Typography.Text>
                        <SchemaCodeEditor
                            value={JSON.stringify(schema, null, 2)}
                            lang="json"
                            height="45vh"
                            valueType="schema"
                        />
                    </Col>
                    <Col xs={12} style={{ overflowX: "hidden", height: "100%" }}>
                        <Typography.Text strong>UI Schema</Typography.Text>
                        <SchemaCodeEditor
                            value={JSON.stringify(uiSchema, null, 2)}
                            lang="json"
                            height="25vh"
                            valueType="uiSchema"
                        />
                    </Col>
                    <Col xs={12} style={{ overflowX: "hidden", height: "100%" }}>
                        <Typography.Text strong>Form data</Typography.Text>
                        <SchemaCodeEditor
                            value={JSON.stringify(formData, null, 2)}
                            lang="json"
                            height="25vh"
                            isReadOnly
                        />
                    </Col>
                </Row>
            </Modal>
        </Layout.Sider>
    );
}
