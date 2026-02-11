import { CloseCircleFilled, MenuOutlined } from "@ant-design/icons";
import { Image, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import Search from "antd/es/input/Search";
import formuleLogo from "../assets/logo.png";
import { RefObject } from "react";

interface AppHeaderProps {
    menuHidden: boolean;
    setMenuHidden: (hidden: boolean) => void;
    inputId: string;
    setInputId: (id: string) => void;
    inputRef: RefObject<any>;
    loading: boolean;
    error: any;
    onFetch: () => void;
}

export function AppHeader({
    menuHidden,
    setMenuHidden,
    inputId,
    setInputId,
    inputRef,
    loading,
    error,
    onFetch,
}: AppHeaderProps) {
    return (
        <Header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: "#001529",
                padding: "0 20px",
            }}
        >
            {menuHidden && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "20px",
                        cursor: "pointer",
                    }}
                    onClick={() => setMenuHidden(!menuHidden)}
                >
                    <Image
                        src={formuleLogo}
                        alt="Logo"
                        preview={false}
                        style={{ width: "50px", maxWidth: "120px" }}
                    />
                    <MenuOutlined style={{ color: "white", fontSize: "36" }} />
                </div>
            )}
            <Space.Compact style={{ flex: 1, maxWidth: 720 }}>
                <Search
                    id="main-search"
                    ref={inputRef}
                    size="large"
                    prefix="INSPIRE ID:"
                    placeholder="Enter INSPIRE id (e.g., 1511149)"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                    onPressEnter={onFetch}
                    onSearch={onFetch}
                    allowClear
                    loading={loading}
                />
            </Space.Compact>
            {error && <CloseCircleFilled style={{ color: "red" }} />}
        </Header>
    );
}
