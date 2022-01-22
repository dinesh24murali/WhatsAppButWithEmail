import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setSingleMessage, markNewMessageForContact } from 'slices/contactsSlice';
import Socket from 'modules/Dashboard/Socket/Socket';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    isSendMessage: state.contacts.isSendMessage
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setSingleMessage,
      markNewMessageForContact
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Socket);
