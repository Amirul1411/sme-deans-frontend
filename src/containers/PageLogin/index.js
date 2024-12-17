import React from "react";
import { connect } from "react-redux";
import { userLogin } from "@redux/actions";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import LoginForm from "./LoginForm";
import NavBar from "@components/NavBar";
import Footer from "@components/Footer";
import * as styles from "./style.scss";

const translations = {
  en: {
    staffLogin: "Staff Login"
  },
  ms: {
    staffLogin: "Log Masuk Staf"
  },
  zh: {
    staffLogin: "员工登录"
  },
  tm: {
    staffLogin: "பணியாளர் உள்நுழைவு"
  }
};

class PageLogin extends React.Component {
  state = {
    redirect: false,
  };

  setRedirect = () => {
    this.setState({ redirect: true });
  };

  render() {
    const { language } = this.props;
    const columnTitles = translations[language.language] || translations.en;

    if (this.state.redirect) return <Redirect to="/staff/dashboard" />;

    return (
      <React.Fragment>
        <NavBar />
        <div className={styles.container}>
          <div className={styles.innerContainer}>
            <div className={styles.header}>{columnTitles.staffLogin}</div>
            <div className={styles.form}>
              <LoginForm
                setRedirect={this.setRedirect}
                userLogin={this.props.userLogin}
                flag={this.props.flag}
              />
            </div>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

PageLogin.propTypes = {
  flag: PropTypes.bool.isRequired,
  userLogin: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
};

export default connect(
  state => {
    const { staff } = state;
    return {
      flag: staff.flag || false,
      language: state.language,
    };
  },
  dispatch => ({
    userLogin: form => dispatch(userLogin(form)),
  })
)(PageLogin);
