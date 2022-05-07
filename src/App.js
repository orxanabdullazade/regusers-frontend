import "./App.css";
import "antd/dist/antd.css";
import RegUsers from "./components/RegUsers";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

function App() {
  return (
    <div className="App">
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div
            className="logo"
            style={{
              height: 32,
              margin: 16,
              background: "rgba(255, 255, 255, 0.2",
            }}
          />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]}>
            <Menu.Item key="4" icon={<UserOutlined />}>
              İstifadəçilər
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            className="site-layout-sub-header-background"
            style={{ padding: 0 }}
          />
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: "80vh" }}
            >
              <RegUsers />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
             ©2022 Created by orxanzadeh
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
