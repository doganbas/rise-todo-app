import {Modal} from 'antd';
import i18next from 'i18next';

const UserConfirmation = (message: string, callback: (status: boolean) => void) => {
    Modal.confirm({
        title: i18next.t('company-panel-dont-save-prompt-title', 'Veri Kaybı Uyarısı!')?.toString(),
        content: message,
        okType: 'danger',
        okText: i18next.t('company-panel-dont-save-prompt-button', 'Devam Et')?.toString(),
        cancelText: i18next.t('company-panel-dont-save-prompt-cancel', 'İptal')?.toString(),
        onOk() {
            callback(true);
        },
        onCancel() {
            callback(false);
        }
    });
};

export default UserConfirmation;