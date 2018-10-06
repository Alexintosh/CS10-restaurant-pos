import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Elements } from 'react-stripe-elements';

import { subscribe, unsubscribe } from '../../../redux/actions/payments';
import { updateEmployee } from '../../../redux/actions/auth';
import { addItem, getItems } from '../../../redux/actions/items';
import { openModal } from '../../../redux/actions/modal';
import RestaurantInfo from '../../Presentational/RestaurantInfo';
import Billing from '../../Presentational/Billing';
import UpdateEmployee from '../../Presentational/UpdateEmployee';
import CreateItem from '../../Presentational/CreateItem';
import Modal from '../../HOC/Modal';
import StripeRegisterForm from '../../StripeRegisterForm';

import * as s from './styles';

class SettingsPage extends React.Component {
  componentDidMount() {
    this.props.getItems();
  }

  updateEmployee = (info) => {
    this.props.updateEmployee(info);
  };

  adminDisplay = () => (
    <React.Fragment>
      {!this.props.membership && (
        <Billing
          membership={this.props.membership}
          subscribe={this.props.subscribe}
          modalIsOpen={this.props.modalIsOpen}
          openModal={this.props.openModal}
        />
      )}
      <RestaurantInfo />
    </React.Fragment>
  );

  managerDisplay = () => (
    <React.Fragment>
      <CreateItem addItem={this.props.addItem} itemCategories={this.props.itemCategories} />
    </React.Fragment>
  );

  render() {
    const { membership, modalIsOpen } = this.props;
    const { admin, manager } = this.props.role;
    return (
      <React.Fragment>
        <Modal isOpen={modalIsOpen}>
          <div>Hey, pay for the sub!</div>
          <div>The sub costs 100 bucks</div>
          <Elements>
            <StripeRegisterForm subscribe={this.props.subscribe} />
          </Elements>
        </Modal>
        <s.Container modalOpen={modalIsOpen}>
          <s.CardContainer>
            {admin && this.adminDisplay()}
            {(manager || admin) && this.managerDisplay()}
          </s.CardContainer>
          <s.CardContainer>
            <UpdateEmployee updateEmployee={this.updateEmployee} authorized={admin} />
          </s.CardContainer>
          {membership && (
            // This one appears at the end of the list if the user has a membership
            <Billing membership={this.props.membership} unsubscribe={this.props.unsubscribe} />
          )}
        </s.Container>
      </React.Fragment>
    );
  }
}

SettingsPage.propTypes = {
  role: PropTypes.shape({
    admin: PropTypes.bool,
    manager: PropTypes.bool
  }),
  membership: PropTypes.bool,
  itemCategories: PropTypes.arrayOf(PropTypes.string),
  modalIsOpen: PropTypes.bool,
  openModal: PropTypes.func,
  addItem: PropTypes.func,
  getItems: PropTypes.func,
  subscribe: PropTypes.func,
  unsubscribe: PropTypes.func,
  updateEmployee: PropTypes.func
};

SettingsPage.defaultProps = {
  role: {
    admin: false,
    manager: false
  },
  membership: false,
  itemCategories: ['default category one, default category two'],
  modalIsOpen: false,
  openModal: () => {},
  addItem: () => {},
  getItems: () => {},
  subscribe: () => {},
  unsubscribe: () => {},
  updateEmployee: () => {}
};

const mapStateToProps = (state) => ({
  role: state.auth.role,
  membership: state.auth.membership,
  itemCategories: state.items.itemList.reduce((acc, currentVal) => {
    if (currentVal.category && !acc.includes(currentVal.category)) {
      acc.push(currentVal.category);
    }
    return acc;
  }, [])
});

export default connect(
  mapStateToProps,
  { openModal, addItem, getItems, subscribe, unsubscribe, updateEmployee }
)(SettingsPage);
