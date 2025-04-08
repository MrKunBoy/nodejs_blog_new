# nodejs_blog_new

1. users.controller.ts – Xử lý API cho User.
2. users.service.ts – Chứa logic nghiệp vụ User.
3. users.repository.ts – Tương tác với MongoDB.
4. users.interface.ts – Định nghĩa contract repository.
5. user.schema.ts – Định nghĩa schema User trong MongoDB.

const user = await userRepository.findOneById(userId, null, {
populate: 'role', // ✅ Hỗ trợ string đơn
});

const userWithPosts = await userRepository.findOneById(userId, null, {
populate: ['role', 'posts'], // ✅ Hỗ trợ mảng string
});

const userWithRoleDetails = await userRepository.findOneById(userId, null, {
populate: { path: 'role', select: 'name' }, // ✅ Hỗ trợ object
});

const userWithMultiplePopulates = await userRepository.findOneById(userId, null, {
populate: [
{ path: 'role', select: 'name' },
{ path: 'posts', select: 'title' }
], // ✅ Hỗ trợ mảng object
});
