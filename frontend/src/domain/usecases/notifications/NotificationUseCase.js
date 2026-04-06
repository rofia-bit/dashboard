export class NotificationUseCase {

    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    async getNotifications(userId) {
        return await this.notificationRepository.getNotifications(userId);
    }

    async markAsRead(notificationId) {
        return await this.notificationRepository.markAsRead(notificationId);
    }
}