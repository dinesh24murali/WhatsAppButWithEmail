import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { verifyEmail, updatePassword } from 'slices/authSlice';
import VerifyEmail from 'modules/Auth/VerifyEmail/VerifyEmail';

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      verifyEmail,
      updatePassword
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
