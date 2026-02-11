import { Tabs } from "antd";
import { CodeViewer } from "react-formule";

interface PreviewPanelProps {
    formData: any;
}

export function PreviewPanel({ formData }: PreviewPanelProps) {
    const pdfTabs = formData?.documents
        ?.filter((doc: any) => doc?.url)
        .map((doc: any, idx: number) => ({
            label: "PDF",
            key: `pdf-${idx}`,
            children: (
                <iframe
                    style={{ width: "100%", height: "100%", border: "none" }}
                    src={doc?.url}
                />
            ),
        })) || [];

    const doiValue = formData?.dois?.[0]?.value;

    const doiTab = {
        label: "DOI",
        key: "doi",
        children: doiValue ? (
            <div style={{ flex: 1, width: "100%" }}>
                <strong>{doiValue}</strong> (
                <a href={`https://doi.org/${doiValue}`}>link</a>)
                <hr />
                <iframe
                    style={{ width: "100%", height: "100%", border: "none" }}
                    src={`https://doi.org/${doiValue}`}
                />
            </div>
        ) : (
            <div style={{ padding: 20, textAlign: "center", color: "#999" }}>
                No DOI available
            </div>
        ),
    };

    const jsonTab = {
        label: "JSON",
        key: "json",
        children: (
            <div style={{ width: "100%", flex: 1 }}>
                <CodeViewer
                    value={JSON.stringify(formData, null, 2)}
                    lang="json"
                    height="100%"
                    reset={true}
                />
            </div>
        ),
    };

    return (
        <Tabs
            style={{ flex: 1, width: "100%", display: "flex" }}
            defaultActiveKey={pdfTabs.length > 0 ? "pdf-0" : "doi"}
            items={[...pdfTabs, doiTab, jsonTab]}
        />
    );
}
