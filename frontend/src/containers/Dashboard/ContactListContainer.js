import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addContacts, markAsRead } from 'slices/contactsSlice';
import ContactList from 'modules/Dashboard/ContactList/ContactList';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    contacts: state.contacts.contacts
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      addContacts,
      markAsRead
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactList);
