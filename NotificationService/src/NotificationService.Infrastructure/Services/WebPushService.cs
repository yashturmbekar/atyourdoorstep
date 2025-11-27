using NotificationService.Application.Interfaces;
using WebPush;

namespace NotificationService.Infrastructure.Services;

public class WebPushService : IWebPushService
{
    private readonly string _publicKey;
    private readonly string _privateKey;
    private readonly string _subject;

    public WebPushService(string publicKey, string privateKey, string subject)
    {
        _publicKey = publicKey;
        _privateKey = privateKey;
        _subject = subject;
    }

    public async Task<bool> SendNotificationAsync(
        string endpoint, 
        string p256dh, 
        string auth, 
        object payload, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            var subscription = new PushSubscription(endpoint, p256dh, auth);
            var vapidDetails = new VapidDetails(_subject, _publicKey, _privateKey);
            
            var webPushClient = new WebPushClient();
            var payloadJson = System.Text.Json.JsonSerializer.Serialize(payload);
            
            await webPushClient.SendNotificationAsync(subscription, payloadJson, vapidDetails);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }
}
