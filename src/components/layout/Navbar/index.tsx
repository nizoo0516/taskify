
  return (
    <>
      <div className="fixed top-0 right-0 bg-white">
        <div className="flex justify-between">
          <h2 className="text-xl-bold">{title}</h2>
          <div>
            <button>관리</button>
            <button>초대하기</button>
            <ol>
              {members.length > 0 &&
                memvers.map((member) => <li key={member.id}>{member.profileImageUrl}</li>)}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
