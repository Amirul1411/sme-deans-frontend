import React from "react";
import PropTypes from "prop-types";
import NavBar from "@components/NavBar";
import Footer from "@components/Footer";
import CrisisReportForm from "./CrisisReportForm";
import { connect } from "react-redux";
import { getCrises, fetchTypes, reportCrises } from "@redux/actions";
import * as styles from "./style.scss";

const translations = {
  en: {
    reportCrisis: "Report Crisis",
    thankYou: "Thank you for reporting the crisis!",
    callUs: "If you prefer to report over the phone, please call us directly at",
    phoneNumber: "12345678"
  },
  ms: {
    reportCrisis: "Lapor Krisis",
    thankYou: "Terima kasih kerana melaporkan krisis!",
    callUs: "Jika anda lebih suka melaporkan melalui telefon, sila hubungi kami di nombor",
    phoneNumber: "12345678"
  },
  zh: {
    reportCrisis: "报告危机",
    thankYou: "感谢您报告危机！",
    callUs: "如果您更喜欢通过电话报告，请直接拨打我们的电话",
    phoneNumber: "12345678"
  },
  tm: {
    reportCrisis: "கிரிஸ் அறிக்கை செய்க",
    thankYou: "கிரிஸை அறிக்கை செய்ததற்கு நன்றி!",
    callUs: "நீங்கள் தொலைபேசியில் அறிக்கை செய்ய விரும்பினால், தயவுசெய்து எங்களை நேரடியாக அழைக்கவும்",
    phoneNumber: "12345678"
  }
};

class PageReport extends React.Component {
  state = {
    completed: false
  };

  componentDidMount() {
    this.props.fetchTypes();
    this.fetchData();
  }

  setComplete = () => {
    this.setState({ completed: true });
  };

  fetchData = () => {
    this.props.getCrises();
  };

  render() {
    const { completed } = this.state;
    const { language } = this.props;
    const translationsText = translations[language.language] || translations.en;

    return (
      <React.Fragment>
        <NavBar />
        <div className={styles.container}>
          <div className={styles.header}>{translationsText.reportCrisis}</div>
          {completed ? (
            <div style={{ marginTop: "2rem" }}>
              {translationsText.thankYou}
            </div>
          ) : (
            <React.Fragment>
              <div style={{ marginTop: "2rem" }}>
                {translationsText.callUs}{" "}
                <strong>{translationsText.phoneNumber}</strong>.
              </div>
              <div className={styles.form}>
                <CrisisReportForm
                  crisisType={this.props.crisisType || []}
                  assistanceType={this.props.assistanceType || []}
                  reportCrises={this.props.reportCrises}
                  setComplete={this.setComplete}
                  flag={this.props.flag}
                />
              </div>
            </React.Fragment>
          )}
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

PageReport.propTypes = {
  crisisType: PropTypes.array.isRequired,
  assistanceType: PropTypes.array.isRequired,
  crises: PropTypes.array.isRequired,
  fetchTypes: PropTypes.func.isRequired,
  getCrises: PropTypes.func.isRequired,
  reportCrises: PropTypes.func.isRequired,
  flag: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  const { system, common } = state;
  return {
    flag: common && common.flag,
    crisisType: system && system.crisisType,
    assistanceType: system && system.assistanceType,
    crises: common && common.crises,
    language: state.language
  };
};

const mapDispatchToProps = dispatch => ({
  fetchTypes: () => dispatch(fetchTypes()),
  getCrises: () => dispatch(getCrises()),
  reportCrises: form => dispatch(reportCrises(form)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageReport);
