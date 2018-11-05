import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  addCrisisType,
  addAssistanceType,
  fetchTypes,
  getEmergencyAgencies
} from "@redux/actions";
import { Button, Input, Tag, message } from "antd";
import EmergencyAgenciesTable from "./EmergencyAgenciesTable";
import * as styles from "./style.scss";

class PageSetting extends React.Component {
  state = {
    reportingEmail: {
      edited: false,
      content: null
    }
  };

  componentDidMount() {
    this.props.fetchTypes();
    this.props.getEmergencyAgencies();
  }

  componentDidUpdate = prevProps => {
    if (prevProps.crisisType !== this.props.crisisType) this.createCrisisTags();
  };

  createCrisisTags = () => {
    const { crisisType } = this.props;
    if (!crisisType) return [];
    return Object.keys(crisisType).map((val, index) => (
      <Tag color="purple" key={index}>
        {crisisType[val]}
      </Tag>
    ));
  };

  createAssistanceTags = () => {
    const { assistanceType } = this.props;
    if (!assistanceType) return [];
    return Object.keys(assistanceType).map((val, index) => (
      <Tag color="geekblue" key={index}>
        {assistanceType[val]}
      </Tag>
    ));
  };

  handleEmailChange = e => {
    this.setState({
      ...this.state,
      reportingEmail: {
        edited: true,
        content: e.target.value
      }
    });
  };

  addCrisisType = () => {
    const name = prompt("Enter the name of new crisis");
    const form = new FormData();
    form.append("name", name);
    this.props
      .addCrisisType(form)
      .then(() => message.success("Success!"))
      .catch(() => message.error("Error!"));
  };

  render() {
    return (
      <div>
        <h1>Setting</h1>
        <div className={styles.subHeader}>
          <div>Crisis Type</div>
          <Button>Add</Button>
        </div>
        <div className={styles.tagContainer}>{this.createCrisisTags()}</div>
        <div className={styles.subHeader}>
          <div>Assistance Type</div>
          <Button>Add</Button>
        </div>
        <div className={styles.tagContainer}>{this.createAssistanceTags()}</div>
        {/* <div className={styles.subHeader}>
          <div>Social Media Account</div>
        </div> */}
        {/* <div className={styles.socialMediaAccountContainer}>
          <div className={styles.item + " " + styles.label}>Social Media</div>
          <div className={styles.item + " " + styles.label}>Account</div>
          <div className={styles.item + " " + styles.label}>Password</div>
          <div className={styles.item + " " + styles.label}>Actions</div>
          <div className={styles.item}>Facebook</div>
          <div className={styles.item}>
            <Input type="text" defaultValue="john.doe@gmail.com" />
          </div>
          <div className={styles.item}>
            <Input type="password" defaultValue="123123" />
          </div>
          <div className={styles.item}>
            <div className={styles.actions}>
              <Button type="primary">Save</Button>
              <Button type="danger">Delete</Button>
            </div>
          </div>
          <div className={styles.item}>Twitter</div>
          <div className={styles.item}>
            <Input type="text" defaultValue="john.doe@gmail.com" />
          </div>
          <div className={styles.item}>
            <Input type="password" defaultValue="123123" />
          </div>
          <div className={styles.item}>
            <div className={styles.actions}>
              <Button type="primary" disabled>Save</Button>
              <Button type="danger">Delete</Button>
            </div>
          </div>
        </div> */}
        <div className={styles.subHeader}>
          <div>Emergency Agencies</div>
          <Button onClick={this.addCrisisType}>Add</Button>
        </div>
        <div className={styles.emergencyAgenciesContainer}>
          <EmergencyAgenciesTable
            emergencyAgencies={this.props.emergencyAgencies || []}
          />
        </div>
        <div className={styles.subHeader}>
          <div>Summary Reporting Email</div>
          <Button type="primary" disabled={!this.state.reportingEmail.edited}>
            Save
          </Button>
        </div>
        <div className={styles.summaryReportingEmailContainer}>
          <Input
            defaultValue="prime-minister@gmail.com"
            onChange={this.handleEmailChange}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { system } = state;
  return {
    crisisType: system && system.crisisType,
    assistanceType: system && system.assistanceType,
    emergencyAgencies: system && system.emergencyAgencies
  };
};

PageSetting.propTypes = {
  addCrisisType: PropTypes.func.isRequired,
  addAssistanceType: PropTypes.func.isRequired,
  fetchTypes: PropTypes.func.isRequired,
  crisisType: PropTypes.object.isRequired,
  assistanceType: PropTypes.object.isRequired,
  getEmergencyAgencies: PropTypes.func.isRequired,
  emergencyAgencies: PropTypes.array.isRequired
};

const mapDispatchToProps = dispatch => ({
  addCrisisType: form => dispatch(addCrisisType(form)),
  addAssistanceType: form => dispatch(addAssistanceType(form)),
  fetchTypes: () => dispatch(fetchTypes()),
  getEmergencyAgencies: () => dispatch(getEmergencyAgencies())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageSetting);
