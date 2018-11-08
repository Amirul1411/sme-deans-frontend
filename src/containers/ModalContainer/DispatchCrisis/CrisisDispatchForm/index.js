import React from "react";
import { Form, Select, Button } from "antd";

const FormItem = Form.Item;
const Option = Select.Option;

const emergencyAgencies = ["Ambulance", "Fire Brigade", "Police"];

const createEmergencyAgenciesList = arr =>
  arr.map((value, index) => (
    <Option value={value} key={index}>
      {value}
    </Option>
  ));

class CrisisDispatchForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: []
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        sm: { span: 8 }
      },
      wrapperCol: {
        sm: { span: 15 }
      }
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="Agencies">
          {getFieldDecorator("agencies", {
            rules: [
              {
                type: "array",
                required: true,
                message: "Please select emergency agencies!"
              }
            ]
          })(
            <Select
              mode="multiple"
              placeholder="Select emergency agencies to notify"
            >
              {createEmergencyAgenciesList(emergencyAgencies)}
            </Select>
          )}
        </FormItem>
        <FormItem style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Dispatch
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(CrisisDispatchForm);
