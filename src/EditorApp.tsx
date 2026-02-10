import {
    FileTextOutlined,
    InfoCircleOutlined,
    SearchOutlined,
    ReloadOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    LoadingOutlined,
    Loading3QuartersOutlined,
    ArrowLeftOutlined,
    MenuOutlined,
    CloseCircleFilled,
} from "@ant-design/icons";
import {
    Button,
    Col,
    Grid,
    Image,
    InputNumber,
    Layout,
    Menu,
    Modal,
    message,
    Row,
    Space,
    Tabs,
    Tooltip,
    Typography,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    SchemaCodeEditor,
    RJSFForm,
    FormuleContext,
    SchemaWizardState,
    isUnsaved,
    CodeDiffViewer,
    CodeViewer,
} from "react-formule";
import { theme } from "./theme";
import formuleLogo from "./assets/logo.png";

import "./style.css";
import { Header } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import Input from "antd/es/input/Input";
import { fetchHepSchema, fetchInspireRecord } from "./services/inspire";
import hepSchema from "../schemas/hep.json";
import { TAB_KEYS } from "./configs";
import Search from "antd/es/input/Search";

const { Content, Footer } = Layout;
const { useBreakpoint } = Grid;

const { schema, uiSchema } = hepSchema;

type TabType = keyof typeof TAB_KEYS;

function filterSchemaByTab(schema: any, tab: TabType): any {
    if (!schema || typeof schema !== "object" || !schema.properties) {
        return schema;
    }

    const allowedKeys = TAB_KEYS[tab];
    const filteredProperties: Record<string, any> = {};

    for (const key of allowedKeys) {
        if (key in schema.properties) {
            filteredProperties[key] = schema.properties[key];
        }
    }

    return {
        ...schema,
        properties: filteredProperties,
    };
}

function replaceDescriptionWithTooltip(schema) {
    if (Array.isArray(schema)) {
        return schema.map(replaceDescriptionWithTooltip);
    }

    if (schema && typeof schema === "object") {
        const out = {};
        for (const [key, value] of Object.entries(schema)) {
            const newKey = key === "description" ? "tooltip" : key;
            out[newKey] = replaceDescriptionWithTooltip(value);
        }
        return out;
    }

    return schema;
}

const App = () => {
    const screens = useBreakpoint();

    const [menuHidden, setMenuHidden] = useState(screens.md);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const [showPreview, setShowPreview] = useState(true);

    const [inputId, setInputId] = useState('593382');
    const inputRef = useRef(null);

    const [initialData, setInitialData] = useState({});
    const [formData, setformData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cleanedSchema = useCallback((tab) => {
        return replaceDescriptionWithTooltip(filterSchemaByTab(schema, tab)) || schema || {}
    }, [schema])


    const handleFetch = async () => {
        const id = String(inputId).trim();
        if (!id) {
            message.warning('Please enter an INSPIRE id');
            inputRef.current?.focus();
            return;
        }
        setError(null);
        setLoading(true);
        setformData({});
        try {
            const json = await fetchInspireRecord(id);
            setInitialData(json?.metadata);
            setformData(json?.metadata);
            message.success('Record loaded');
        } catch (e: any) {
            setError(e);
            message.error(e.message || 'Fetch failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormuleContext theme={theme}>
            <Layout hasSider style={{ height: "100vh" }}>
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
                            justifyItems: "center",
                            alignContent: "center",
                            alignItems: "center"
                        }}
                        onClick={() => setMenuHidden(!menuHidden)}
                    >
                        <MenuOutlined style={{ fontSize: 36 }} />
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
                            height: "calc(100% - 80px)",
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
                        title="Generated JSON schemas"
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
                            <Col
                                xs={24}
                                style={{
                                    overflowX: "hidden",
                                    height: "100%",
                                }}
                            >
                                <Typography.Text strong>Schema</Typography.Text>
                                <SchemaCodeEditor
                                    value={JSON.stringify(schema, null, 2)}
                                    lang="json"
                                    height="45vh"
                                    valueType="schema"
                                />
                            </Col>
                            <Col
                                xs={12}
                                style={{
                                    overflowX: "hidden",
                                    height: "100%",
                                }}
                            >
                                <Typography.Text strong>UI Schema</Typography.Text>
                                <SchemaCodeEditor
                                    value={JSON.stringify(
                                        uiSchema,
                                        null,
                                        2,
                                    )}
                                    lang="json"
                                    height="25vh"
                                    valueType="uiSchema"
                                />
                            </Col>
                            <Col
                                xs={12}
                                style={{
                                    overflowX: "hidden",
                                    height: "100%",
                                }}
                            >
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
                <Layout style={{ marginInlineStart: !menuHidden ? 64 : 0 }}>
                    <Header style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', gap: 16, background: '#001529', padding: "0 20px" }}>
                        {menuHidden && <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "20px"
                            }}
                            onClick={() => setMenuHidden(!menuHidden)}
                        >
                            <Image
                                src={formuleLogo}
                                alt="Logo"
                                preview={false}
                                style={{ width: "50px", maxWidth: "120px" }}
                            />
                        </div>
                        }
                        <MenuOutlined color="red" size={50} />
                        <Space.Compact style={{ flex: 1, maxWidth: 720 }}>
                            <Search
                                ref={inputRef as any}
                                size="large"
                                width={100}
                                prefix={"INSPIRE ID:"}
                                placeholder="Enter INSPIRE id (e.g., 1511149)"
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                onPressEnter={handleFetch}
                                onSearch={handleFetch}
                                allowClear
                                loading={loading}
                            />
                        </Space.Compact>
                        {error && <CloseCircleFilled style={{ color: "red" }} />}
                    </Header>
                    <Content
                        style={{
                            overflowY: "scroll",
                            scrollSnapType: screens.md ? "none" : "y mandatory",
                        }}
                    >
                        <Row style={{ height: "100%" }}>
                            <Col
                                xs={24}
                                md={showPreview ? 14 : 24}
                                style={{
                                    overflowX: "hidden",
                                    height: "100%",
                                    scrollSnapAlign: screens.md ? "none" : "start",
                                    padding: "10px"
                                }}
                            >
                                <Tabs
                                    style={{ flex: 1 }}
                                    destroyOnHidden={true}
                                    tabBarStyle={{ borderBottom: "2px solid #ccc" }}
                                    items={[
                                        {
                                            label: 'Main',
                                            children: <RJSFForm
                                                schema={cleanedSchema("main")}
                                                uiSchema={uiSchema}
                                                formData={formData}
                                                onChange={({ formData }) => setformData(formData)}
                                            />,
                                            key: '1'
                                        },
                                        {
                                            label: 'References',
                                            children: <RJSFForm
                                                schema={cleanedSchema("refs") || schema || {}}
                                                uiSchema={uiSchema}
                                                formData={formData}
                                                onChange={({ formData }) => setformData(formData)}
                                            />, key: '2'
                                        },
                                        {
                                            label: 'Authors', children: <RJSFForm
                                                schema={cleanedSchema("authors") || schema || {}}
                                                uiSchema={uiSchema}
                                                formData={formData}
                                                onChange={({ formData }) => setformData(formData)}
                                            />, key: '3'
                                        }
                                    ]}
                                />
                            </Col>
                            {
                                showPreview ?
                                    <Col
                                        xs={14}
                                        md={10}
                                        className="previewTabs"
                                        style={{
                                            overflowX: "hidden",
                                            height: "100%",
                                            padding: "0px 15px",
                                            backgroundColor: "#F6F7F8",
                                            scrollSnapAlign: screens.md ? "none" : "start",
                                        }}
                                    >
                                        <Tabs
                                            style={{ flex: 1, width: "100%", display: 'flex' }}
                                            defaultActiveKey="1"
                                            items={[
                                                ...(formData?.documents?.map(doc => ({
                                                    label: 'PDF',
                                                    children: <iframe
                                                        style={{ width: '100%', height: '100%', border: 'none' }}
                                                        src={doc?.url} />,
                                                    key: '1'
                                                })) || []),
                                                {
                                                    label: 'DOI',
                                                    children: <div style={{ flex: 1, width: "100%" }}>
                                                        <strong>{formData?.dois && formData?.dois[0]?.value}</strong> (<a href={`https://doi.org/${formData?.dois && formData?.dois[0]?.value}`} >link</a>)
                                                        <hr />
                                                        <iframe
                                                            style={{ width: '100%', height: '100%', border: 'none' }}
                                                            src={`https://doi.org/${formData?.dois && formData?.dois[0]?.value}`} />

                                                    </div>,
                                                    key: '2'
                                                },
                                                {
                                                    label: 'JSON',
                                                    children: <div style={{ width: '100%', flex: 1 }}><CodeViewer
                                                        value={JSON.stringify(
                                                            formData,
                                                            null,
                                                            2,
                                                        )}
                                                        lang="json"
                                                        height="100%"
                                                        reset={true}
                                                    /></div>,
                                                    key: '3'
                                                }
                                            ]}
                                        />

                                    </Col> : null
                            }
                        </Row>
                    </Content>
                    <Footer style={{ padding: 0 }}>
                        <Row
                            align="bottom"
                            justify="center"
                            style={{ padding: "5px", background: "#001529" }}
                        >
                            <Space direction="horizontal" size="middle">
                                <Typography.Text style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                                    Running react-formule v{import.meta.env.REACT_FORMULE_VERSION}
                                </Typography.Text>
                            </Space>
                        </Row>
                    </Footer>
                </Layout>
            </Layout>
        </FormuleContext >
    );
};

export default App;
