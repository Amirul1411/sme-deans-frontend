import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { showModal, resolveCrisis, getCrises } from "@redux/actions";
import { Modal, Button, Table, message, Tag, Alert, Spin } from "antd";
import { CRISIS_STATUS, CRISIS_STATUS_LABELS, CRISIS_STATUS_COLORS } from "@constants/crisis";
import * as styles from "./style.scss";

const resolve = (id, flag, resolveCrisis, getCrises, undo) => {
  Modal.confirm({
    title: undo ? "Activate crisis?" : "Resolve crisis?",
    content: `The crisis will be marked as ${undo ? "pending" : "resolved"}.`,
    onOk() {
      resolveCrisis(id, undo)
        .then(() => {
          message.success(`Crisis has been ${undo ? "activated" : "resolved"}.`, 2);
        })
        .catch(error => {
          message.error(error || "Failed to update crisis status", 2);
        });
    },
  });
};

const COLUMNS = [
  {
    title: "Crisis Type",
    dataIndex: "crisisType",
    key: "crisisType",
    width: 100,
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    width: 300,
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    width: 150,
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    width: 100,
    sorter: (a, b) => a.statusOrder - b.statusOrder,
  },
];

const createDataSource = (
  flag,
  crisisList,
  crisisType,
  dispatchCrisis,
  editCrisis,
  resolveCrisis,
  getCrises
) =>
  crisisList
    .map(crisis => {
      const id = crisis.crisis_id;
      const type = crisis.crisis_type
        .map(val => crisisType && crisisType[val])
        .map((type, index) => (
          <Tag key={index} color="purple">
            {type}
          </Tag>
        ));
      const location = crisis.crisis_location1.replace(/"/g, "");
      const status = crisis.crisis_status;
      return {
        key: id,
        crisisType: type,
        location: location,
        statusOrder: Object.values(CRISIS_STATUS).indexOf(status),
        status: (
          <span
            style={{
              color: CRISIS_STATUS_COLORS[status],
            }}
          >
            {CRISIS_STATUS_LABELS[status]}
          </span>
        ),
        action: (
          <div className={styles.actions}>
            <Button 
              disabled={status === CRISIS_STATUS.RESOLVED} 
              onClick={() => dispatchCrisis(crisis)}
            >
              Dispatch
            </Button>
            <Button
              onClick={() => resolve(
                id, 
                flag, 
                resolveCrisis, 
                getCrises, 
                status === CRISIS_STATUS.RESOLVED
              )}
              type="danger"
            >
              {status === CRISIS_STATUS.RESOLVED ? "Activate" : "Resolve"}
            </Button>
          </div>
        ),
        detail: crisis,
      };
    })
    .sort((a, b) => a.statusOrder - b.statusOrder);

const CrisisListTable = props => {
  const { crises, crisisType, resolveCrisis, flag, getCrises, loading, error } = props;

  const dispatchCrisis = crisis => {
    props.showModal("DISPATCH_CRISIS", { crisis });
  };

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ marginBottom: 16 }}
      />
    );
  }

  return (
    <Spin spinning={loading}>
      <Table
        dataSource={createDataSource(
          flag,
          crises || [],
          crisisType,
          dispatchCrisis,
          null,
          resolveCrisis,
          getCrises
        )}
        columns={COLUMNS}
      />
    </Spin>
  );
};

CrisisListTable.propTypes = {
  flag: PropTypes.bool.isRequired,
  crises: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  crisisType: PropTypes.object,
  assistanceType: PropTypes.object,
  getCrises: PropTypes.func.isRequired,
  resolveCrisis: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
};

export default connect(
  state => {
    const { system, staff, common } = state;
    return {
      flag: staff.flag || false,
      loading: common.loading,
      error: common.error,
      crisisType: system && system.crisisType,
      assistanceType: system && system.assistanceType,
    };
  },
  dispatch => ({
    resolveCrisis: (id, undo) => dispatch(resolveCrisis(id, undo)),
    getCrises: () => dispatch(getCrises()),
    showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
  })
)(CrisisListTable);
