import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { startRealTimeCrisisTracking } from "@redux/actions";

// RealTimeCrisisTracker component is responsible for triggering real-time crisis tracking
// when the component is mounted.
class RealTimeCrisisTracker extends React.Component {
  // When the component is mounted, it triggers the real-time crisis tracking action.
  componentDidMount = () => this.props.startRealTimeCrisisTracking(); // Start tracking real-time crises on mount (every 10 min)

  // Render the children passed to this component.
  render() {
    return this.props.children; // The component just renders its children.
  }
}

// Define the expected prop types for RealTimeCrisisTracker component
RealTimeCrisisTracker.propTypes = {
  // Prop for triggering real-time crisis tracking action
  startRealTimeCrisisTracking: PropTypes.func.isRequired,
  
  // Children elements that will be rendered inside the component
  children: PropTypes.object.isRequired,
};

// Map the dispatch to props to connect the component with Redux actions
const mapDispatchToProps = dispatch => ({
  // Bind the action creator startRealTimeCrisisTracking to the props
  startRealTimeCrisisTracking: () => dispatch(startRealTimeCrisisTracking()),
});

// Connect the component with Redux and export it
export default connect(null, mapDispatchToProps)(RealTimeCrisisTracker);
