const inviteMemberMap = new Map()

module.exports = {
  offer (memberId, codeUsed) {
    inviteMemberMap.set(memberId, codeUsed)
  },
  ask (memberId) {
    if (inviteMemberMap.size > 200) { // I'd like a slice of bot with no memory leaks please.
      inviteMemberMap.clear()
    }
    const fetchedCode = inviteMemberMap.get(memberId)
    if (fetchedCode) inviteMemberMap.delete(memberId)
    return fetchedCode
  }
}
