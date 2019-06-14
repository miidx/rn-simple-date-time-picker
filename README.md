[moment-format-url]: [https://momentjs.com/docs/#/displaying/]
# rn-simple-date-time-picker


## Usage  

```jsx
    <SimplePicker  
        animationType="fade"
        label="Due Time"
        onDateSelected={(value) => this.setState({ dueTime: value }) }
    />
```

## Properties

 Name             | Description                                 | Type      | Required | Default Value  
:---------------- |:------------------------------------------- |:----------|:--------:|:-------------
 animationType    | Animation type when opening drop down. `fade` or `sliede` (IOS Only)   | String    |          | fade     
 label            | Picker label                                | String    |          |          
 error            | Error message to be shown                   | String    |          |          
 disabled         | Set the control to disabled mode            | boolean   |          | false         
 cancelCaption    | Caption for `cancel` button                 | String    |          | Cancel         
 okCaption        | Caption for `OK` button                     | String    |          | OK         
 enabledColor     | Color for the control when in enabled mode  | String    |          | `#2f2f2f`         
 disabledColor    | Color for the control when in disabled mode | String    |          | `#8C8C8C`         
 format           | Format to display selected date/time. See [moment.js format][moment-format-url]        | String    |          | `ISO 8601` format
 mode             | one of `date`, `time`, or `datetime`        | String    |          | `datetime`         
 selectedDate     | Set or get selected date/time value in `ISO 8601` format | string    |          |          
 onDateSelected   | Callback when user select a date/time       | function  |          |          
