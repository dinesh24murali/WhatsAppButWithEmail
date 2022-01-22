import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getUserContacts, createOrUpdateFcmToken } from 'slices/contactsSlice';
import Dashboard from 'modules/Dashboard/Dashboard';

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getUserContacts,
      createOrUpdateFcmToken
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
