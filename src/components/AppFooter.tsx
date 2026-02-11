import { Row, Space, Typography } from "antd";
import { Footer } from "antd/es/layout/layout";

export function AppFooter() {
    return (
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
    );
}
