import React from "react";
import PropTypes from "prop-types";
import { Form, Input, Tooltip, Icon, Select, Button } from "antd";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import { connect } from "react-redux";


const FormItem = Form.Item;
const Option = Select.Option;

const translations = {
  en: {
    yourName: "Your Name",
    mobileNumber: "Mobile Number",
    location: "Location",
    location2: "Location 2",
    crisisType: "Crisis Type",
    crisisDescription: "Crisis Description",
    assistanceType: "Assistance Type",
    assistanceDescription: "Assistance Description",
    submit: "Submit",
    questionTooltip: "Your real name",
    crisisDescriptionPlaceholder: "Anything we must know?",
    assistanceDescriptionPlaceholder: "If you selected others, specify your assistance request here"
  },
  ms: {
    yourName: "Nama Anda",
    mobileNumber: "Nombor Telefon",
    location: "Lokasi",
    location2: "Lokasi 2",
    crisisType: "Jenis Krisis",
    crisisDescription: "Keterangan Krisis",
    assistanceType: "Jenis Bantuan",
    assistanceDescription: "Keterangan Bantuan",
    submit: "Hantar",
    questionTooltip: "Nama sebenar anda",
    crisisDescriptionPlaceholder: "Apa-apa yang perlu kami ketahui?",
    assistanceDescriptionPlaceholder: "Jika anda memilih lain-lain, nyatakan permintaan bantuan anda di sini"
  },
  zh: {
    yourName: "您的姓名",
    mobileNumber: "手机号码",
    location: "地点",
    location2: "第二地点",
    crisisType: "危机类型",
    crisisDescription: "危机描述",
    assistanceType: "援助类型",
    assistanceDescription: "援助描述",
    submit: "提交",
    questionTooltip: "您的真实姓名",
    crisisDescriptionPlaceholder: "我们需要知道的事情？",
    assistanceDescriptionPlaceholder: "如果您选择了其他，请在这里指定您的援助请求"
  },
  ta: {
    yourName: "உங்கள் பெயர்",
    mobileNumber: "கைபேசி எண்",
    location: "இடம்",
    location2: "இரண்டாவது இடம்",
    crisisType: "விபத்து வகை",
    crisisDescription: "விபத்து விவரம்",
    assistanceType: "உதவி வகை",
    assistanceDescription: "உதவி விவரம்",
    submit: "சமர்ப்பிக்கவும்",
    questionTooltip: "உங்கள் உண்மையான பெயர்",
    crisisDescriptionPlaceholder: "நாம் அறிவது அவசியமான விஷயங்கள்?",
    assistanceDescriptionPlaceholder: "நீங்கள் மற்றவை தேர்ந்தெடுத்திருந்தால், உங்கள் உதவி கோரிக்கையை இங்கு குறிப்பிடவும்"
  }
};

const createSelectionList = obj =>
  Object.keys(obj).map((val, index) => (
    <Option value={val} key={index}>
      {obj[val]}
    </Option>
  ));

class CrisisReportForm extends React.Component {
  state = {
    confirmDirty: false,
    address: "",
    gps: null
  };

  handleChange = () => null; // dummy

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => {
        return getLatLng(results[0]);
      })
      .then(gps => {
        this.setState({ gps, address });
        this.props.form.setFieldsValue({
          location: address
        });
      })
      .catch(error => console.error("Error", error));
  };

  handleSubmit = e => {
    e.preventDefault();
    e.disabled = true;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          name,
          phone,
          location_2,
          crisisType,
          crisisDescription,
          assistanceType,
          assistanceDescription
        } = values;
        const form = new FormData();
        form.append("your_name", name);
        form.append("mobile_number", phone);
        if (crisisType && crisisType.length > 0) {
          for (const type of crisisType) {
            form.append("crisis_type", type);
          }
        }
        if (assistanceType && assistanceType.length > 0) {
          for (const type of assistanceType) {
            form.append("crisis_assistance", type);
          }
        }
        form.append("crisis_status", "PD");
        form.append("crisis_location1", JSON.stringify(this.state.address)); // important because object makes no sense in REST
        form.append(
          "crisis_location2",
          typeof location_2 === "undefined" ? "" : location_2
        );
        form.append(
          "crisis_description",
          typeof crisisDescription === "undefined" ? "" : crisisDescription
        );
        form.append(
          "crisis_assistance_description",
          typeof assistanceDescription === "undefined" ? "" : crisisDescription
        );
        this.props
          .reportCrises(form)
          .then(() => {
            this.props.setComplete();
          })
          .catch(error => console.log(error));
      }
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { language } = this.props;
    const t = translations[language.language] || translations.en;

    const formItemLayout = {
      labelCol: {
        sm: { span: 5 }
      },
      wrapperCol: {
        sm: { span: 18 }
      }
    };
    const prefixSelector = getFieldDecorator("prefix", {
      initialValue: "65"
    })(
      <Select disabled style={{ width: 70 }}>
        <Option value="65">+65</Option>
      </Select>
    );

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              {t.yourName}&nbsp;
              <Tooltip title="Your real name">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator("name", {
            rules: [
              {
                required: true,
                message: "Please input your name!",
                whitespace: true
              }
            ]
          })(<Input placeholder={t.yourName}  />)}
        </FormItem>
        <FormItem {...formItemLayout} label={t.mobileNumber} >
          {getFieldDecorator("phone", {
            rules: [
              { required: true, message: "Please input your mobile number!" }
            ]
          })(<Input addonBefore={prefixSelector} style={{ width: "100%" }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label={<span>{t.location} </span>}>
          {getFieldDecorator("location", {
            rules: [
              {
                required: true,
                message: "Please input the location!",
                whitespace: true
              }
            ]
          })(
            <PlacesAutocomplete
              onChange={this.handleChange}
              onSelect={this.handleSelect}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading
              }) => {
                return (
                  <React.Fragment>
                    <Input
                      {...getInputProps({
                        placeholder: "Search places..."
                      })}
                    />
                    <div className="autocomplete-dropdown-container">
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion, index) => {
                        const className = suggestion.active
                          ? "suggestion-item--active"
                          : "suggestion-item";
                        // inline style for demonstration purpose
                        const style = suggestion.active
                          ? { backgroundColor: "#fafafa", cursor: "pointer" }
                          : { backgroundColor: "#ffffff", cursor: "pointer" };
                        return (
                          <div
                            key={index}
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              style
                            })}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  </React.Fragment>
                );
              }}
            </PlacesAutocomplete>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={<span>{t.location2}</span>}>
          {getFieldDecorator("location_2", {
            rules: [
              {
                required: false,
                whitespace: true
              }
            ]
          })(<Input placeholder="Room number, block number, street name..." />)}
        </FormItem>
        <FormItem {...formItemLayout} label={t.crisisType} >
          {getFieldDecorator("crisisType", {
            rules: [
              {
                type: "array",
                required: true,
                message: "Please select crisis type!"
              }
            ]
          })(
            <Select mode="multiple" placeholder="Select crisis type(s)">
              {createSelectionList(this.props.crisisType)}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t.crisisDescription}>
          {getFieldDecorator("crisisDescription", {
            rules: [{ required: false }]
          })(
            <Input
              style={{ width: "100%" }}
              placeholder="Anything we must know?"
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t.assistanceType} >
          {getFieldDecorator("assistanceType", {
            rules: [
              {
                type: "array",
                required: false
              }
            ]
          })(
            <Select mode="multiple" placeholder="Select assistance(s) required">
              {createSelectionList(this.props.assistanceType)}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t.assistanceDescription} >
          {getFieldDecorator("assistanceDescription", {
            rules: [{ required: false }]
          })(
            <Input
              style={{ width: "100%" }}
              placeholder="If you selected others, specify your assistance request here"
            />
          )}
        </FormItem>
        <FormItem style={{ width: "100%", textAlign: "right" }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "30%", marginTop: "2rem", marginRight: "2rem" }}
          >
            {t.submit} 
          </Button>
        </FormItem>
      </Form>
    );
  }
}

CrisisReportForm.propTypes = {
  crisisType: PropTypes.array.isRequired,
  assistanceType: PropTypes.array.isRequired,
  flag: PropTypes.bool.isRequired,
  reportCrises: PropTypes.func.isRequired,
  setComplete: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  language: state.language
});

export default connect(mapStateToProps)(Form.create()(CrisisReportForm));
