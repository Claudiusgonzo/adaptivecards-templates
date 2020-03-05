import React from 'react';

import { Template } from 'adaptive-templating-service-typescript-node';

import Config from '../../../Config';
import ShareModalForm from './ShareModalForm';

import { closeModal } from '../../../store/page/actions';
import { connect } from 'react-redux';

import { TextField, Button } from 'office-ui-fabric-react';

import {
  BackDrop,
  Modal,
  Header,
  Description,
  CenterPanelWrapper,
  ShareLinkPanel,
  SemiBoldText,
  LinkRow,
  TextFieldContainer
} from './styled';
import ModalHOC from '../../../utils/ModalHOC';

interface ShareModalProps {
  template: Template;
  templateVersion?: string;
  closeModal: () => void;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    closeModal: () => {
      dispatch(closeModal());
    }
  }
}

class ShareModal extends React.Component<ShareModalProps> {

  render() {
    return (
      <BackDrop>
        <Modal>
          <Header>Share template version</Header>
          <Description>You will be sharing your template below. Shared users can only view your template.</Description>
          <CenterPanelWrapper>
            <ShareLinkPanel>
              <SemiBoldText>Share with link</SemiBoldText>
              <LinkRow>
                <TextFieldContainer>
                  <TextField readOnly={true}
                    prefix={Config.redirectUri}
                    defaultValue={"/preview/" + this.props.template.id + "/" + this.props.templateVersion}
                    width={100} />
                </TextFieldContainer>
                <Button iconProps={{ iconName: 'Copy' }} onClick={() => { onCopy(this.props) }}>
                  Copy
                </Button>
              </LinkRow>
            </ShareLinkPanel>
            <ShareModalForm shareURL={Config.redirectUri + "/preview/" + this.props.template.id + "/" + this.props.templateVersion} templateVersion={this.props.templateVersion} />
          </CenterPanelWrapper>
        </Modal>

      </BackDrop>

    );
  }
}

function onCopy(props: ShareModalProps) {
  let copyCode = document.createElement('textarea');
  copyCode.innerText = Config.redirectUri + "/preview/" +
    props.template.id + "/" + props.templateVersion;
  document.body.appendChild(copyCode);
  copyCode.select();
  document.execCommand('copy');
  copyCode.remove();
}

export default ModalHOC(connect(undefined, mapDispatchToProps)(ShareModal));
