// @flow
import React, { Component } from 'react';
import { Label, Modal } from 'semantic-ui-react';

import './index.css';

type State = {
  modalIsOpen: boolean,
};

type Props = {
  children: any,
  labelProps?: {
    color?: string,
    ribbon?: string,
  },
  label: string,
};

class UpgradesModalContainer extends Component<Props, State> {
  state = {
    modalIsOpen: false,
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    const { children, labelProps, label } = this.props;
    return (
      <Modal
        trigger={
          <Label as="a" onClick={this.openModal}>
            {label}
          </Label>
        }
        open={this.state.modalIsOpen}
        onClose={this.closeModal}
        size="small"
      >
        <Modal.Header>Upgrade products</Modal.Header>
        <Modal.Content>{children}</Modal.Content>
      </Modal>
    );
  }
}

export default UpgradesModalContainer;
