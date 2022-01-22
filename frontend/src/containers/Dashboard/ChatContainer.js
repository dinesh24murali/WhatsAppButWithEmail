import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { onSendMessage, getMessages, setEnableScrollToBorrom } from 'slices/contactsSlice';
import Chat from 'modules/Dashboard/Chat/Chat';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    messages: state.contacts.messages,
    enableScrollToBorrom: state.contacts.enableScrollToBorrom
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      onSendMessage,
      setEnableScrollToBorrom,
      getMessages
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
