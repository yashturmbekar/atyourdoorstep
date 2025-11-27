using NotificationService.Domain.Entities;

namespace NotificationService.Application.Interfaces;

public interface IPushSubscriptionRepository
{
    Task<PushSubscription?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PushSubscription?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<PushSubscription>> GetActiveSubscriptionsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<PushSubscription>> GetByUserIdsAsync(IEnumerable<Guid> userIds, CancellationToken cancellationToken = default);
    Task<PushSubscription> AddAsync(PushSubscription subscription, CancellationToken cancellationToken = default);
    Task UpdateAsync(PushSubscription subscription, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

public interface INotificationRepository
{
    Task<Notification?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Notification>> GetByUserIdAsync(Guid userId, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<IEnumerable<Notification>> GetUnreadByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Notification> AddAsync(Notification notification, CancellationToken cancellationToken = default);
    Task UpdateAsync(Notification notification, CancellationToken cancellationToken = default);
    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default);
}
