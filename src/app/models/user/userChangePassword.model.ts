export interface UserChangePassword {
    resetPasswordToken: string;
    newPassword: string;
    repeatNewPassword: string;
}