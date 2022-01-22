import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { login } from 'slices/authSlice';
import Login from 'modules/Auth/Login/Login';

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      login
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
