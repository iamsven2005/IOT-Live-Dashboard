"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';

interface FeatureRequest {
  id: string;
  email: string;
  suggest: string;
  like: number;
  dislike: number;
  votes: { userId: string; vote: boolean }[];
}

interface Props {
  user: string;
  isAdmin: boolean;
}

const FeatureRequestList = ({ user, isAdmin }: Props) => {
  const mockUserId = user;
  const [requests, setRequests] = useState<FeatureRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/request');
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Failed to fetch feature requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleVote = async (id: string, vote: boolean) => {
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          waitlistId: id,
          userId: mockUserId,
          vote,
        }),
      });

      if (response.ok) {
        const updatedVote = await response.json();
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === id
              ? {
                  ...request,
                  like: vote ? request.like + 1 : request.like - 1,
                  dislike: vote ? request.dislike - 1 : request.dislike + 1,
                  votes: request.votes.map((v) =>
                    v.userId === mockUserId
                      ? { ...v, vote }
                      : v
                  ),
                }
              : request
          )
        );
      } else {
        const error = await response.json();
        console.error(error);
        alert(error.error);
      }
    } catch (error) {
      console.error('Failed to submit vote:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/request', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
      } else {
        const error = await response.json();
        console.error(error);
        alert(error.error);
      }
    } catch (error) {
      console.error('Failed to delete feature request:', error);
    }
  };

  return (
    <Card>
      <CardTitle>Feature Requests</CardTitle>
      {requests.map((request) => {
        const userVote = request.votes.find((v) => v.userId === mockUserId);
        const userHasLiked = userVote ? userVote.vote : false;

        return (
          <CardContent key={request.id} className="request-item">
            <p>{request.suggest}</p>
            <p>Email: {request.email}</p>
            <div>
              <Button
                onClick={() => handleVote(request.id, true)}
                className={userHasLiked ? 'active' : ''}
              >
                Like {request.like}
              </Button>
              <Button
                onClick={() => handleVote(request.id, false)}
                className={!userHasLiked ? 'active' : ''}
              >
                Dislike {request.dislike}
              </Button>
              {isAdmin && (
                <Button onClick={() => handleDelete(request.id)} className="ml-2">
                  Delete
                </Button>
              )}
            </div>
          </CardContent>
        );
      })}
    </Card>
  );
};

export default FeatureRequestList;
