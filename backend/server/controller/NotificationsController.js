const Notidb = require("../model/Notifications/Notifications");


exports.GetAllNotifications = async (req, res) => {

    const userId = req.user._id

    const notifications = await Notidb.find({ user_id: userId }).sort({ _id: -1 });
    const unreadNoti = notifications.filter(noti => !noti.isRead);
    const unreadNotiNumber = unreadNoti.length;

    res.status(200).json({
        message: "Successful",
        notifications: notifications,
        unreadNoti: unreadNoti,
        unreadNotiNumber: unreadNotiNumber
    })
}

exports.MarkAllAsRead = async (req, res) => {
    const userId = req.user._id

    await Notidb.updateMany({ user_id: userId }, {
        isRead: true
    })

    res.status(200).json({
        message: "Successful",
    })

}

exports.MarkOneAsRead = async (req, res) => {
    const notiId = req.params.id;

    await Notidb.findByIdAndUpdate( notiId, {
        isRead: true
    })

    res.status(200).json({
        message: "Successful",
    })

}