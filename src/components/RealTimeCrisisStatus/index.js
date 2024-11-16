import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Icon } from "antd";
import * as styles from "./style.scss";

const translations = {
  en: {
    crisisOverview: "Crisis Overview",
    activeCrisis: "Active crisis",
    internetStatus: "Internet Status",
    online: "Online",
  },
  ms: {
    crisisOverview: "Gambaran Krisis",
    activeCrisis: "Krisis Aktif",
    internetStatus: "Status Internet",
    online: "Dalam Talian",
  },
  zh: {
    crisisOverview: "危机概览",
    activeCrisis: "当前危机",
    internetStatus: "互联网状态",
    online: "在线",
  },
  tm: {
    crisisOverview: "விபத்து கண்ணோட்டம்",
    activeCrisis: "செயல்பாட்டு விபத்து",
    internetStatus: "இணைய நிலை",
    online: "ஆன்லைன்",
  },
};


const RealTimeCrisisStatus = (props) => {
  const { crises, language } = props || {};
  
  const t = translations[language.language] || translations.en;

  // Count active crises with 'DP' status
  const num = crises && crises.filter(crisis => crisis.crisis_status === "DP").length;

  return (
    <div className={styles.container}>
      <div>
        <strong>{t.crisisOverview}</strong>
      </div>
      <div>
        {t.activeCrisis}: <strong>{num}</strong>
      </div>
      <div className={styles.internet}>
        {t.internetStatus}:
        <Icon
          type="check-circle"
          theme="twoTone"
          twoToneColor="#52c41a"
          style={{ marginLeft: "0.5rem" }}
        />{" "}
        {t.online}
      </div>
    </div>
  );
};

RealTimeCrisisStatus.propTypes = {
  crises: PropTypes.array,
  language: PropTypes.string,
};

const mapStateToProps = (state) => {
  const { common } = state;
  return {
    crises: common && common.crises,
    language: state.language,
  };
};

export default connect(mapStateToProps)(RealTimeCrisisStatus);
