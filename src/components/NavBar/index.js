import React from "react";
import { Popover, Button, message, Dropdown, Menu } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentUser, userLogout } from "@redux/actions";
import { Link } from "react-router-dom";
import logo from "@assets/logo.png";
import { setLanguage } from "@redux/languageActions";

import * as styles from "./style.scss";

const translations = {
  en: {
    home: "Home",
    report: "Report",
    logout: "Logout",
    login: "Login",
    language: "Language",
    deansCrisisSystem: "Dean's Crisis Management System",
  },
  ms: {
    home: "Laman Utama",
    report: "Laporan",
    logout: "Log Keluar",
    login: "Log Masuk",
    language: "Bahasa",
    deansCrisisSystem: "Sistem Pengurusan Krisis Dekan",
  },
  zh: {
    home: "首页",
    report: "报告",
    logout: "登出",
    login: "登录",
    language: "语言",
    deansCrisisSystem: "院长危机管理系统",
  },
  tm: {
    home: "முகப்பு",
    report: "அறிக்கை",
    logout: "வெளியேறு",
    login: "உள்நுழைவு",
    language: "மொழி",
    deansCrisisSystem: "டீனின் கிரைசிஸ் மேலாண்மை அமைப்பு",
  },
};

class NavBar extends React.Component {
  componentDidMount() {
    this.props.getCurrentUser();
  }

  handleLanguageChange = (lang) => {
    this.props.setLanguage(lang);
    message.success(`Language changed to ${lang === "en" ? "English" : lang === "ms" ? "Malay" : lang === "zh" ? "Mandarin" : "Tamil"}`);
  };

  render() {
    const { currentUser, language } = this.props;

    const t = translations[language] || translations.en;

    const menu = (
      <Menu>
        <Menu.Item key="en" onClick={() => this.handleLanguageChange("en")}>
          EN | English
        </Menu.Item>
        <Menu.Item key="ms" onClick={() => this.handleLanguageChange("ms")}>
          MY | Malay
        </Menu.Item>
        <Menu.Item key="zh" onClick={() => this.handleLanguageChange("zh")}>
          ZH | Mandarin
        </Menu.Item>
        <Menu.Item key="tm" onClick={() => this.handleLanguageChange("tm")}>
          TM | Tamil
        </Menu.Item>
      </Menu>
    );

    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.item}>
            <Link to="/">
              <img src={logo} alt="Logo" className={styles.logo} />
            </Link>
          </div>
          <div className={`${styles.item} ${styles.brand}`}>
            <Link to="/">{t.deansCrisisSystem}</Link>
          </div>
          <div className={styles.item}>
            <Link to="/">{t.home}</Link>
          </div>
          <div className={styles.item}>
            <Link to="/report">{t.report}</Link>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.item}>
            {currentUser ? (
              <Popover
                placement="bottom"
                content={
                  <Button
                    onClick={() => {
                      this.props.userLogout().then(() => {
                        message.success("You are logged out");
                        location.assign("/");
                      });
                    }}
                  >
                    {t.logout}
                  </Button>
                }
              >
                <Link to="/staff/dashboard">{currentUser}</Link>
              </Popover>
            ) : (
              <Link to="/login">{t.login}</Link>
            )}
          </div>
          <div className={styles.item}>
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button>{t.language}</Button>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
}

NavBar.propTypes = {
  getCurrentUser: PropTypes.func.isRequired,
  userLogout: PropTypes.func.isRequired,
  currentUser: PropTypes.string,
  language: PropTypes.string.isRequired,
  setLanguage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { staff, language } = state;
  return {
    currentUser: staff && staff.currentUser,
    language: language.language,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getCurrentUser: () => dispatch(getCurrentUser()),
  userLogout: () => dispatch(userLogout()),
  setLanguage: (language) => dispatch(setLanguage(language)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
