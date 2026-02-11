import { Col, Grid, Layout, message, Row } from "antd";
import { useCallback, useRef, useState } from "react";
import { FormuleContext } from "react-formule";
import { theme } from "./theme";

import "./style.css";
import { fetchInspireRecord } from "./services/inspire";
import hepSchema from "../schemas/hep.json";
import { filterSchemaByTab, replaceDescriptionWithTooltip, TabType } from "./utils/schemaUtils";
import { Sidebar } from "./components/Sidebar";
import { AppHeader } from "./components/AppHeader";
import { EditorTabs } from "./components/EditorTabs";
import { PreviewPanel } from "./components/PreviewPanel";
import { AppFooter } from "./components/AppFooter";

const { Content } = Layout;
const { useBreakpoint } = Grid;

const { schema, uiSchema } = hepSchema;

const App = () => {
    const screens = useBreakpoint();

    const [menuHidden, setMenuHidden] = useState(screens.md ?? true);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const [showPreview, setShowPreview] = useState(true);

    const [inputId, setInputId] = useState("593382");
    const inputRef = useRef(null);

    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const cleanedSchema = useCallback(
        (tab: TabType) => {
            return replaceDescriptionWithTooltip(filterSchemaByTab(schema, tab)) || schema || {};
        },
        [schema]
    );

    const handleFetch = async () => {
        const id = String(inputId).trim();
        if (!id) {
            message.warning("Please enter an INSPIRE id");
            (inputRef.current as any)?.focus();
            return;
        }
        setError(null);
        setLoading(true);
        setFormData({});
        try {
            const json = await fetchInspireRecord(id);
            setFormData(json?.metadata);
            message.success("Record loaded");
        } catch (e: any) {
            setError(e);
            message.error(e.message || "Fetch failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormuleContext theme={theme}>
            <Layout hasSider style={{ height: "100vh" }}>
                <Sidebar
                    menuHidden={menuHidden}
                    setMenuHidden={setMenuHidden}
                    showPreview={showPreview}
                    setShowPreview={setShowPreview}
                    viewerOpen={viewerOpen}
                    setViewerOpen={setViewerOpen}
                    helpOpen={helpOpen}
                    setHelpOpen={setHelpOpen}
                    schema={schema}
                    uiSchema={uiSchema}
                    formData={formData}
                />

                <Layout style={{ marginInlineStart: !menuHidden ? 64 : 0 }}>
                    <AppHeader
                        menuHidden={menuHidden}
                        setMenuHidden={setMenuHidden}
                        inputId={inputId}
                        setInputId={setInputId}
                        inputRef={inputRef}
                        loading={loading}
                        error={error}
                        onFetch={handleFetch}
                    />

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
                                    padding: "10px",
                                }}
                            >
                                <EditorTabs
                                    cleanedSchema={cleanedSchema}
                                    uiSchema={uiSchema}
                                    formData={formData}
                                    onFormDataChange={setFormData}
                                />
                            </Col>

                            {showPreview && (
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
                                    <PreviewPanel formData={formData} />
                                </Col>
                            )}
                        </Row>
                    </Content>

                    <AppFooter />
                </Layout>
            </Layout>
        </FormuleContext>
    );
};

export default App;
