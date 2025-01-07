import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { startRealTimeConditionTracking } from "@redux/actions";

// RealTimeCrisisTracker component is responsible for starting real-time condition tracking
// when the component is mounted.
class RealTimeCrisisTracker extends React.Component {
  // When the component mounts, it triggers the real-time condition tracking action
  // with a delay of 10 minutes (600000 milliseconds).
  componentDidMount = () => this.props.startRealTimeConditionTracking(600000); // Start condition tracking with 10 min interval

  // Render the children passed to this component.
  render() {
    return this.props.children; // The component just renders its children.
  }
}

// Define the expected prop types for RealTimeCrisisTracker component
RealTimeCrisisTracker.propTypes = {
  // Prop for triggering real-time condition tracking action with a time interval
  startRealTimeConditionTracking: PropTypes.func.isRequired,
  
  // Children elements that will be rendered inside the component
  children: PropTypes.object.isRequired,
};

// Map the dispatch to props to connect the component with Redux actions
const mapDispatchToProps = dispatch => ({
  // Bind the action creator startRealTimeConditionTracking to the props
  // The action is passed a time interval (in milliseconds)
  startRealTimeConditionTracking: time => dispatch(startRealTimeConditionTracking(time)),
});

// Connect the component with Redux and export it
export default connect(null, mapDispatchToProps)(RealTimeCrisisTracker);
