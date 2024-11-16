import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as styles from "./style.scss";

const translations = {
  en: {
    weatherOverview: "Weather Overview",
    temperature: "Temperature",
    humidity: "Humidity",
    rainfall: "Rainfall",
  },
  ms: {
    weatherOverview: "Gambaran Cuaca",
    temperature: "Suhu",
    humidity: "Kelembapan",
    rainfall: "Hujan",
  },
  zh: {
    weatherOverview: "天气概况",
    temperature: "温度",
    humidity: "湿度",
    rainfall: "降水量",
  },
  tm: {
    weatherOverview: "வானிலை கண்ணோட்டம்",
    temperature: "தাপநிலை",
    humidity: "ஊட்டச்சத்து",
    rainfall: "மழை",
  },
};

const RealTimeWeather = (props) => {
  const { temperature, humidity, rainfall, language } = props;
  
  const t = translations[language] || translations.en;

  return (
    <div className={styles.container}>
      <div>
        <strong>{t.weatherOverview}</strong>
      </div>
      <div>
        {t.temperature}: <strong>{temperature + "°C"}</strong>
      </div>
      <div>
        {t.humidity}: <strong>{humidity + "%"}</strong>
      </div>
      <div>
        {t.rainfall}: <strong>{rainfall + "mm"}</strong>
      </div>
    </div>
  );
};

RealTimeWeather.propTypes = {
  temperature: PropTypes.number,
  humidity: PropTypes.number,
  rainfall: PropTypes.number,
  language: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const { common, language } = state;
  return {
    temperature: common && common.temperature,
    humidity: common && common.humidity,
    rainfall: common && common.rainfall,
    language: language.language,
  };
};

export default connect(mapStateToProps)(RealTimeWeather);
