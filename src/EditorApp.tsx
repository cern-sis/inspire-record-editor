import Icon, {
    FileTextOutlined,
    FolderOpenOutlined,
    DeleteOutlined,
    SaveOutlined,
    FileAddOutlined,
    CheckOutlined,
    InfoCircleOutlined,
    DownloadOutlined,
    UploadOutlined,
    RollbackOutlined,
    MenuOutlined,
    CloseOutlined,
    SearchOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import {
    Badge,
    Button,
    Col,
    Drawer,
    Grid,
    Image,
    Layout,
    List,
    Menu,
    message,
    Modal,
    Popconfirm,
    Row,
    Space,
    Tag,
    Tooltip,
    Typography,
    Upload,
} from "antd";
import { useEffect, useRef, useState } from "react";
import {
    SchemaCodeEditor,
    FormPreview,
    FormuleContext,
    SchemaPreview,
    SchemaWizardState,
    SelectOrEdit,
    deleteFromLocalStorage,
    getAllFromLocalStorage,
    initFormuleSchema,
    isUnsaved,
    saveToLocalStorage,
    loadFromLocalStorage,
    AiChatFooter,
} from "react-formule";
import { theme } from "./theme";
import formuleLogo from "./assets/logo.png";
import SparklesIcon from "./assets/sparkles.svg?react";

import "./style.css";
import { Header } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import Input from "antd/es/input/Input";
import { fetchHepSchema, fetchInspireRecord } from "./services/inspire";

const { Content, Footer } = Layout;
const { useBreakpoint } = Grid;

const App = () => {
    const [formuleState, setFormuleState] = useState<SchemaWizardState>();
    const [localSchemas, setLocalSchemas] = useState(getAllFromLocalStorage());
    const [viewerOpen, setViewerOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const [justSaved, setJustSaved] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [aiFooterOpen, setAiFooterOpen] = useState(() => {
        const storedAIState = localStorage.getItem("aiFooterOpen");
        return storedAIState ? JSON.parse(storedAIState) : true;
    });


    // const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    // const { message: antdMessage } = AntApp.useApp?.() || { message };

    const [inputId, setInputId] = useState('');
    const inputRef = useRef<Input>(null as any);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<any | null>(null);

    const [schemaLoading, setSchemaLoading] = useState(true);
    const [schema, setSchema] = useState<any | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setSchemaLoading(true);
                const s = await fetchHepSchema();
                setSchema(s);
            } catch (e: any) {
                setError(e);
            } finally {
                setSchemaLoading(false);
            }
        })();
    }, []);

    // const documents: DocItem[] = useMemo(() => extractDocuments(data), [data]);

    const handleFetch = async () => {
        const id = String(inputId).trim();
        if (!id) {
            // antdMessage.warning('Please enter an INSPIRE id');
            inputRef.current?.focus();
            return;
        }
        setError(null);
        setLoading(true);
        setData(null);
        try {
            const json = await fetchInspireRecord(id);
            setData(json);
            // antdMessage.success('Record loaded');
        } catch (e: any) {
            setError(e);
            // antdMessage.error(e.message || 'Fetch failed');
        } finally {
            setLoading(false);
        }
    };

    const screens = useBreakpoint();
    const [menuHidden, setMenuHidden] = useState(screens.md);

    useEffect(() => {
        localStorage.setItem("aiFooterOpen", JSON.stringify(aiFooterOpen));
    }, [aiFooterOpen]);

    useEffect(() => {
        setHasUnsavedChanges(isUnsaved());
    }, [formuleState]);

    useEffect(() => {
        const handleKeyDowEvent = (e: KeyboardEvent) => {
            if (e.ctrlKey || (e.metaKey && e.key === "s")) {
                e.preventDefault();
                saveLocalSchema();
            }
        };
        window.addEventListener("keydown", handleKeyDowEvent);
        return () => {
            window.removeEventListener("keydown", handleKeyDowEvent);
        };
    }, []);

    const handleFormuleStateChange = (newState: SchemaWizardState) => {
        setFormuleState(newState);
    };

    const handleDownload = (id: string, schema: object) => {
        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(schema, null, 4)], {
            type: "text/json",
        });
        a.href = URL.createObjectURL(file);
        a.download = `formuleForm_${id}.json`;
        a.click();
    };

    const deleteLocalSchema = (id: string) => {
        deleteFromLocalStorage(id).then((list) => setLocalSchemas(list));
        if (id === formuleState?.id) {
            initFormuleSchema();
        }
    };

    const saveLocalSchema = () => {
        saveToLocalStorage().then((list) => {
            setHasUnsavedChanges(isUnsaved());
            setLocalSchemas(list);
            setJustSaved(true);
            setTimeout(() => {
                setJustSaved(false);
            }, 1000);
        });
    };

    return (
        <FormuleContext theme={theme} synchronizeState={handleFormuleStateChange}>
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
                        }}
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
                            height: "calc(100% - 80px)",
                            overflow: "auto",
                        }}
                    >
                        <Menu
                            selectable={false}
                            selectedKeys={[
                                aiFooterOpen ? "ai" : "",
                                drawerOpen ? "load" : "",
                                viewerOpen ? "view" : "",
                                helpOpen ? "help" : "",
                            ]}
                            mode="inline"
                            style={{ borderRight: "none", flex: "auto" }}
                            items={[
                                {
                                    key: "save",
                                    icon: (
                                        <Badge
                                            dot={hasUnsavedChanges}
                                            color={theme.token.colorPrimary}
                                            offset={[6, 8]}
                                        >
                                            {justSaved ? (
                                                <CheckOutlined
                                                    style={{ color: theme.token.colorPrimary }}
                                                />
                                            ) : (
                                                <SaveOutlined />
                                            )}
                                        </Badge>
                                    ),
                                    label: "Save Schema",
                                    onClick: !justSaved ? () => saveLocalSchema() : undefined,
                                },
                                {
                                    key: "view",
                                    icon: <FileTextOutlined />,
                                    label: "View Schema",
                                    onClick: () => setViewerOpen(true),
                                }
                            ]}
                        />
                        <Menu
                            selectable={false}
                            mode="inline"
                            style={{ borderRight: "none" }}
                            items={[
                                {
                                    key: "help",
                                    icon: <InfoCircleOutlined />,
                                    label: "Information",
                                    onClick: () => setHelpOpen(true),
                                },
                                {
                                    style: { display: screens.md ? "none" : undefined },
                                    key: "close",
                                    icon: <CloseOutlined />,
                                    label: "Close menu",
                                    onClick: () => setMenuHidden(!menuHidden),
                                },
                            ]}
                        />
                    </div>
                </Layout.Sider>
                <Layout style={{ marginInlineStart: !menuHidden ? 64 : 0 }}>
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
                                    value={JSON.stringify(formuleState?.current.schema, null, 2)}
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
                                        formuleState?.current.uiSchema,
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
                                    value={JSON.stringify(formuleState?.formData, null, 2)}
                                    lang="json"
                                    height="25vh"
                                    isReadOnly
                                />
                            </Col>
                        </Row>
                    </Modal>
                    <Header style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', gap: 16, background: '#001529' }}>
                        <Title level={4} style={{ color: 'white', margin: 0 }}>Inspire HEP App</Title>
                        <Space.Compact style={{ flex: 1, maxWidth: 720 }}>
                            <Input
                                ref={inputRef as any}
                                size="large"
                                prefix={<SearchOutlined />}
                                placeholder="Enter INSPIRE id (e.g., 1511149)"
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                onPressEnter={handleFetch}
                                allowClear
                            />
                            <Button type="primary" size="large" onClick={handleFetch}>Fetch</Button>
                            <Tooltip title="Clear">
                                <Button size="large" icon={<ReloadOutlined />} onClick={() => { setInputId(''); setData(null); setError(null); }} />
                            </Tooltip>
                        </Space.Compact>
                    </Header>
                    <Content
                        style={{
                            overflowY: "scroll",
                            scrollSnapType: screens.md ? "none" : "y mandatory",
                        }}
                    >
                        <Row style={{ height: "100%" }}>
                            {/* <Col
                                xs={10}
                                md={5}
                                style={{
                                    overflowX: "hidden",
                                    height: "100%",
                                    display: "flex",
                                    scrollSnapAlign: screens.md ? "none" : "start",
                                }}
                            >
                                <SelectOrEdit />
                            </Col>
                            <Col
                                xs={14}
                                md={5}
                                style={{
                                    overflowX: "hidden",
                                    height: "100%",
                                    padding: "0px 15px",
                                    backgroundColor: "#F6F7F8",
                                    scrollSnapAlign: screens.md ? "none" : "start",
                                }}
                            >
                                <SchemaPreview hideSchemaKey={false} />
                            </Col> */}
                            <Col
                                xs={24}
                                md={14}
                                style={{
                                    overflowX: "hidden",
                                    height: "100%",
                                    scrollSnapAlign: screens.md ? "none" : "start",
                                }}
                            >
                                <FormPreview liveValidate={true} hideAnchors={false} />
                            </Col>
                            <Col
                                xs={14}
                                md={10}
                                style={{
                                    overflowX: "hidden",
                                    height: "100%",
                                    padding: "0px 15px",
                                    backgroundColor: "#F6F7F8",
                                    scrollSnapAlign: screens.md ? "none" : "start",
                                }}
                            >
                                <iframe
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                    src="https://doi.org/10.3934/amc.2024056" />
                            </Col>
                        </Row>
                    </Content>
                    <Footer style={{ padding: 0 }}>
                        {/* {aiFooterOpen && <AiChatFooter />} */}
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
                {/* {!screens.md && menuHidden && (
                    <Tooltip title="Open menu">
                        <Button
                            style={{
                                position: "fixed",
                                top: 10,
                                right: 10,
                                zIndex: 1000,
                            }}
                            icon={menuHidden ? <MenuOutlined /> : <CloseOutlined />}
                            onClick={() => setMenuHidden(!menuHidden)}
                        />
                    </Tooltip>
                )} */}
            </Layout>
        </FormuleContext>
    );
};

export default App;
