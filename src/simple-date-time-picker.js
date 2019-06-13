import React, { Component } from 'react';
import {
  DatePickerIOS, View, Modal, TouchableOpacity,
  DatePickerAndroid, TimePickerAndroid, Platform, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import TextField from '@miidx/rn-text-field';
import ButtonText from '@miidx/rn-text-button';

const ios = Platform.OS === 'ios';

const getScreenDimension = () => {
  const statusBarHeight = getStatusBarHeight();
  const { height, width } = Dimensions.get('window');
  return { height: height - statusBarHeight, width };
};
const { width } = getScreenDimension();

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: ios ? 'flex-end' : 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalInnerContainer: {
    alignItems: 'center',
    backgroundColor: ios ? 'rgba(255, 255, 255, 0.9)' : '#fff',
    width: ios ? width : width - 30,
    borderRadius: ios ? 0 : 10,
    paddingTop: ios ? 0 : 20,
    paddingHorizontal: ios ? 0 : 10,
  },
  headerSectionIos: {
    height: 50,
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(230, 230, 230, 1)',
  },
  bodySectionIos: {
    alignSelf: 'stretch',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
};


export default class SimplePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedDate: undefined,
      tempSelectedDate: props.selectedDate ? moment(props.selectedDate).toDate() : new Date(),
    };
  }

    onTextFieldPressed = async () => {
      if (!this.props.disabled) {
        if (ios) {
          this.setState({ showModal: true });
        }
        this.setState(prev => ({ tempSelectedDate: prev.selectedDate || new Date() }));

        if (!ios) {
          if (this.props.mode === 'time') {
            const initialHour = parseInt(moment(this.state.tempSelectedDate).format('H'), 10);
            const initialMinute = parseInt(moment(this.state.tempSelectedDate).format('m'), 10);

            const { action: actionTime, hour, minute } = await TimePickerAndroid.open({
              hour: initialHour,
              minute: initialMinute,
              is24Hour: false, // Will display '2 PM'
            });
            if (actionTime !== TimePickerAndroid.dismissedAction) {
              const date = new Date();
              this.setState({
                tempSelectedDate: new Date(date.getFullYear(),
                  date.getMonth(),
                  date.getDay(),
                  hour,
                  minute, 0),
              });
              this.onDateSelected();
            }
          } else {
            const {
              action: actionDate, year, month, day,
            } = await DatePickerAndroid.open({
              date: moment(this.state.tempSelectedDate).toDate(),
            });

            if (actionDate !== DatePickerAndroid.dismissedAction && this.props.mode === 'datetime') {
              const initialHour = parseInt(moment(this.state.tempSelectedDate).format('H'), 10);
              const initialMinute = parseInt(moment(this.state.tempSelectedDate).format('m'), 10);

              const { action: actionTime, hour, minute } = await TimePickerAndroid.open({
                hour: initialHour,
                minute: initialMinute,
                is24Hour: false, // Will display '2 PM'
              });
              if (actionTime !== TimePickerAndroid.dismissedAction) {
                this.setState({ tempSelectedDate: new Date(year, month, day, hour, minute, 0) });
                this.onDateSelected();
              }
            } else if (actionDate !== DatePickerAndroid.dismissedAction && this.props.mode === 'date') {
              this.setState({ tempSelectedDate: new Date(year, month, day, 0, 0, 0) });
              this.onDateSelected();
            }
          }
        }
      }
    }

    onDateSelected = () => {
      this.setState(prev => ({ selectedDate: prev.tempSelectedDate }));

      const { tempSelectedDate } = this.state;

      const { mode } = this.props;
      let format = 'YYYY-MM-DDTHH-mm-ssZ';
      if (mode === 'date') {
        format = 'YYYY-MM-DD';
      } else if (mode === 'time') {
        format = 'HH:mm:ss';
      }

      this.props.onDateTimeSelected(moment(tempSelectedDate).format(format));
      this.setState({
        showModal: false,
      });
    }

    onCancelPicker = () => {
      this.setState({ showModal: false, tempSelectedDate: undefined });
    }

    onDateValueChanged = (value) => {
      this.setState({ tempSelectedDate: value });
    }

    renderTextField = () => {
      const selectedDate = this.props.selectedDate || this.state.selectedDate;
      const { format, mode } = this.props;
      let formatStr = format;
      if (!formatStr) {
        if (mode === 'datetime') {
          formatStr = 'D MMM YYYY HH:mm';
        } else if (mode === 'date') {
          formatStr = 'D MMMM YYYY';
        } else {
          formatStr = 'HH:mm';
        }
      }

      let iconName = 'calendar';
      if (mode === 'datetime') {
        iconName = 'calendar-clock';
      } else if (mode === 'time') {
        iconName = 'clock-outline';
      }

      if (this.props.disabled) {
        return (
          <TextField
            label={this.props.label}
            error={this.props.error}
            value={selectedDate ? moment(selectedDate).format(formatStr) : undefined}
            baseColor={this.props.disabledColor}
            disabled
            suffixIconName={iconName}
          />
        );
      }
      return (
        <TouchableOpacity onPress={this.onTextFieldPressed}>
          <TextField
            label={this.props.label}
            error={this.props.error}
            value={selectedDate ? moment(selectedDate).format(formatStr) : undefined}
            baseColor={this.props.enabledColor}
            disabled
            suffixIconName={iconName}
          />
        </TouchableOpacity>
      );
    };

    renderIosPicker = () => (
      <View>
        {this.renderTextField()}
        <Modal
          animationType={this.props.animationType}
          transparent
          visible={this.state.showModal}
          onRequestClose={() => {}}
        >
          <View style={[styles.modalContainer]}>
            <View style={[styles.modalInnerContainer]}>
              <View style={styles.headerSectionIos}>
                <ButtonText
                  caption={this.props.cancelCaption}
                  onPress={this.onCancelPicker}
                />
                <ButtonText
                  caption={this.props.okCaption}
                  onPress={this.onDateSelected}
                />
              </View>
              <View style={styles.bodySectionIos}>
                <DatePickerIOS
                  date={this.state.tempSelectedDate}
                  onDateChange={this.onDateValueChanged}
                  mode={this.props.mode}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );

    renderAndroidPicker = () => this.renderTextField()

    render() {
      return ios
        ? this.renderIosPicker()
        : this.renderAndroidPicker();
    }
}

SimplePicker.propTypes = {
  animationType: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  cancelCaption: PropTypes.string,
  okCaption: PropTypes.string,
  enabledColor: PropTypes.string,
  disabledColor: PropTypes.string,
  format: PropTypes.string,
  mode: PropTypes.oneOf(['date', 'datetime']),
  selectedDate: PropTypes.string,
  onDateTimeSelected: PropTypes.func,
};

SimplePicker.defaultProps = {
  animationType: 'fade',
  cancelCaption: 'Cancel',
  okCaption: 'OK',
  label: '',
  error: '',
  disabled: false,
  enabledColor: '#000000',
  disabledColor: '#8C8C8C',
  format: undefined,
  mode: 'datetime',
  selectedDate: undefined,
  onDateTimeSelected: () => {},
};
