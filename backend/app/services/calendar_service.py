from app.models.calendar import CalendarMemo


def create_memo(db, request):

    memo = CalendarMemo(
        memo_date=request.memo_date,
        description=request.description
    )

    try:
        db.add(memo)
        db.commit()
        db.refresh(memo)

    except Exception as e:
        db.rollback()
        raise e

    return {
        "message": "Memo created successfully",
        "memo_id": memo.id
    }


def get_memos_by_date(db, memo_date):

    memos = (
        db.query(CalendarMemo)
        .filter(
            CalendarMemo.memo_date == memo_date
        )
        .all()
    )

    return memos


def update_memo(db, memo_id, request):

    memo = (
        db.query(CalendarMemo)
        .filter(
            CalendarMemo.id == memo_id
        )
        .first()
    )

    if not memo:
        return {
            "message": "Memo not found"
        }

    memo.memo_date = request.memo_date
    memo.description = request.description

    try:
        db.commit()
        db.refresh(memo)

    except Exception as e:
        db.rollback()
        raise e

    return {
        "message": "Memo updated successfully"
    }


def delete_memo(db, memo_id):

    memo = (
        db.query(CalendarMemo)
        .filter(
            CalendarMemo.id == memo_id
        )
        .first()
    )

    if not memo:
        return {
            "message": "Memo not found"
        }

    try:
        db.delete(memo)
        db.commit()

    except Exception as e:
        db.rollback()
        raise e

    return {
        "message": "Memo deleted successfully"
    }

def delete_all(db, memo_date):

    deleted_count = (
        db.query(CalendarMemo)
        .filter(
            CalendarMemo.memo_date == memo_date
        )
        .delete(synchronize_session=False)
    )

    db.commit()

    return {
        "message": f"{deleted_count} memo(s) deleted"
    }